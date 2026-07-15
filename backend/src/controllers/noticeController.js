import { Notice } from '../models/Notice.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendImportantNoticeEmail } from '../services/emailService.js';

export const getNotices = asyncHandler(async (req, res) => {
  const societyId = req.user.societyId._id || req.user.societyId;
  const notices = await Notice.find({ societyId })
    .populate('postedBy', 'name role')
    .sort({ isImportant: -1, createdAt: -1 });

  res.json({ success: true, notices });
});

export const createNotice = asyncHandler(async (req, res) => {
  const { title, content, isImportant = false } = req.body;

  if (!title || !content) {
    throw new AppError('Title and content are required', 400);
  }

  const notice = await Notice.create({
    societyId: req.user.societyId._id || req.user.societyId,
    postedBy: req.user._id,
    title,
    content,
    isImportant: Boolean(isImportant)
  });

  const populated = await notice.populate('postedBy', 'name role');

  if (populated.isImportant) {
    const residents = await User.find({ societyId: req.user.societyId._id || req.user.societyId, role: 'resident' }).select('name email');
    await sendImportantNoticeEmail({ residents, notice: populated });
  }

  res.status(201).json({ success: true, notice: populated });
});
