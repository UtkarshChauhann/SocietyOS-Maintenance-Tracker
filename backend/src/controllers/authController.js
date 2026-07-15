import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';
import { Society } from '../models/Society.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  society: user.societyId && {
    id: user.societyId._id || user.societyId,
    name: user.societyId.name,
    joiningCode: user.societyId.joiningCode
  }
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, societyCode } = req.body;

  if (!name || !email || !password || !societyCode) {
    throw new AppError('Name, email, password, and society code are required', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }

  const society = await Society.findOne({ joiningCode: societyCode.trim().toUpperCase(), isActive: true });
  if (!society) throw new AppError('Invalid or inactive society code', 400);

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role: 'resident', societyId: society._id });
  await user.populate('societyId', 'name joiningCode');
  const token = signToken(user);

  res.status(201).json({
    success: true,
    token,
    user: publicUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash').populate('societyId', 'name joiningCode isActive');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user);

  res.json({
    success: true,
    token,
    user: publicUser(user)
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

export const registerSociety = asyncHandler(async (req, res) => {
  const { societyName, name, email, password, address = '' } = req.body;
  if (!societyName || !name || !email || !password) {
    throw new AppError('Society name, admin name, email, and password are required', 400);
  }
  if (password.length < 8) throw new AppError('Password must be at least 8 characters', 400);
  if (await User.exists({ email: email.toLowerCase() })) throw new AppError('An account with this email already exists', 409);

  let joiningCode;
  do { joiningCode = Society.createJoiningCode(); } while (await Society.exists({ joiningCode }));
  const society = await Society.create({ name: societyName, address, joiningCode });
  const user = await User.create({ name, email, passwordHash: await User.hashPassword(password), role: 'admin', societyId: society._id });
  society.createdBy = user._id;
  await society.save();
  await user.populate('societyId', 'name joiningCode');

  res.status(201).json({ success: true, token: signToken(user), user: publicUser(user), society: { id: society._id, name: society.name, joiningCode: society.joiningCode } });
});
