import crypto from 'crypto';
import { User } from '../models/User.js';
import { PasswordResetOtp } from '../models/PasswordResetOtp.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendPasswordResetOtpEmail } from '../services/emailService.js';

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_INTERVAL_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const hashValue = (value) => crypto.createHash('sha256').update(value).digest('hex');
const genericMessage = 'If an account exists for that email, a verification code has been sent.';

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!email) throw new AppError('Email is required', 400);

  const user = await User.findOne({ email }).select('name email');
  if (user) {
    const now = Date.now();
    let record = await PasswordResetOtp.findOne({ email });
    if (!record || !record.lastSentAt || now - record.lastSentAt.getTime() >= RESEND_INTERVAL_MS) {
      const otp = crypto.randomInt(100000, 1000000).toString();
      record = record || new PasswordResetOtp({ email });
      record.otpHash = hashValue(otp);
      record.expiresAt = new Date(now + OTP_TTL_MS);
      record.lastSentAt = new Date(now);
      record.attempts = 0;
      record.resetTokenHash = null;
      record.resetTokenExpiresAt = null;
      await record.save();
      try {
        await sendPasswordResetOtpEmail({ to: user.email, name: user.name, otp });
      } catch (error) {
        await PasswordResetOtp.deleteOne({ _id: record._id });
        throw error;
      }
    }
  }

  res.json({ success: true, message: genericMessage });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || '').trim();
  const record = await PasswordResetOtp.findOne({ email });

  if (!record || !record.otpHash || record.expiresAt <= new Date() || record.attempts >= MAX_ATTEMPTS) {
    throw new AppError('Invalid or expired verification code', 400);
  }

  const expected = Buffer.from(record.otpHash, 'hex');
  const actual = Buffer.from(hashValue(otp), 'hex');
  const valid = expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  if (!valid) {
    record.attempts += 1;
    await record.save();
    throw new AppError('Invalid or expired verification code', 400);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  record.otpHash = null;
  record.resetTokenHash = hashValue(resetToken);
  record.resetTokenExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  await record.save();

  res.json({ success: true, resetToken });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, password } = req.body;
  if (!resetToken || !password) throw new AppError('Reset token and password are required', 400);
  if (password.length < 8) throw new AppError('Password must be at least 8 characters', 400);

  const record = await PasswordResetOtp.findOne({
    resetTokenHash: hashValue(resetToken),
    resetTokenExpiresAt: { $gt: new Date() }
  });
  if (!record) throw new AppError('Invalid or expired reset session', 400);

  const user = await User.findOne({ email: record.email });
  if (!user) {
    await PasswordResetOtp.deleteOne({ _id: record._id });
    throw new AppError('Invalid or expired reset session', 400);
  }

  user.passwordHash = await User.hashPassword(password);
  await user.save();
  await PasswordResetOtp.deleteOne({ _id: record._id });
  res.json({ success: true, message: 'Password reset successfully. You can now sign in.' });
});
