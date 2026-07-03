import { Complaint, COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from '../models/Complaint.js';
import { ComplaintHistory } from '../models/ComplaintHistory.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { attachOverdue, isComplaintOverdue } from '../utils/overdue.js';
import { sendComplaintStatusEmail } from '../services/emailService.js';

const populateComplaint = (query) =>
  query.populate('resident', 'name email').sort({ createdAt: -1 });

const buildComplaintDetail = async (complaint) => {
  const history = await ComplaintHistory.find({ complaint: complaint._id })
    .populate('changedBy', 'name role')
    .sort({ createdAt: -1 });

  return { ...attachOverdue(complaint), history };
};

export const getComplaintOptions = (_req, res) => {
  res.json({
    success: true,
    categories: COMPLAINT_CATEGORIES,
    statuses: COMPLAINT_STATUSES,
    priorities: COMPLAINT_PRIORITIES
  });
};

export const createComplaint = asyncHandler(async (req, res) => {
  const { category, description } = req.body;

  if (!category || !description) {
    throw new AppError('Category and description are required', 400);
  }

  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const complaint = await Complaint.create({
    resident: req.user._id,
    category,
    description,
    photoUrl
  });

  const populated = await complaint.populate('resident', 'name email');
  res.status(201).json({ success: true, complaint: attachOverdue(populated) });
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ resident: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, complaints: complaints.map(attachOverdue) });
});

export const getAllComplaints = asyncHandler(async (req, res) => {
  const { status, category, priority, startDate, endDate, search } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }
  if (search) {
    filter.description = { $regex: search, $options: 'i' };
  }

  const complaints = await populateComplaint(Complaint.find(filter));
  const decorated = complaints.map(attachOverdue).sort((a, b) => {
    if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.json({ success: true, complaints: decorated });
});

export const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate('resident', 'name email');
  if (!complaint) {
    throw new AppError('Complaint not found', 404);
  }

  const isOwner = String(complaint.resident._id) === String(req.user._id);
  if (req.user.role !== 'admin' && !isOwner) {
    throw new AppError('You can only view your own complaints', 403);
  }

  const detail = await buildComplaintDetail(complaint);
  res.json({ success: true, complaint: detail });
});

export const updateComplaint = asyncHandler(async (req, res) => {
  const { status, priority, note = '' } = req.body;
  const complaint = await Complaint.findById(req.params.id).populate('resident', 'name email');

  if (!complaint) {
    throw new AppError('Complaint not found', 404);
  }

  if (complaint.status === 'Resolved') {
    throw new AppError('Resolved complaints are closed and cannot be edited', 400);
  }

  const nextStatus = status || complaint.status;
  const nextPriority = priority || complaint.priority;

  if (!COMPLAINT_STATUSES.includes(nextStatus)) {
    throw new AppError('Invalid complaint status', 400);
  }

  if (!COMPLAINT_PRIORITIES.includes(nextPriority)) {
    throw new AppError('Invalid complaint priority', 400);
  }

  const changedStatus = complaint.status !== nextStatus;
  const changedPriority = complaint.priority !== nextPriority;

  if (!changedStatus && !changedPriority && !note.trim()) {
    throw new AppError('No changes submitted', 400);
  }

  const oldStatus = complaint.status;
  const oldPriority = complaint.priority;

  complaint.status = nextStatus;
  complaint.priority = nextPriority;
  complaint.resolvedAt = nextStatus === 'Resolved' ? new Date() : null;
  await complaint.save();

  await ComplaintHistory.create({
    complaint: complaint._id,
    changedBy: req.user._id,
    oldStatus,
    newStatus: nextStatus,
    oldPriority,
    newPriority: nextPriority,
    note
  });

  if (changedStatus) {
    await sendComplaintStatusEmail({
      resident: complaint.resident,
      complaint,
      oldStatus,
      note
    });
  }

  const detail = await buildComplaintDetail(complaint);
  res.json({ success: true, complaint: detail });
});

export const getDashboard = asyncHandler(async (_req, res) => {
  const [statusRows, categoryRows, unresolved] = await Promise.all([
    Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    Complaint.find({ status: { $ne: 'Resolved' } }).select('status createdAt')
  ]);

  const byStatus = COMPLAINT_STATUSES.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});
  statusRows.forEach((row) => {
    byStatus[row._id] = row.count;
  });

  const byCategory = {};
  categoryRows.forEach((row) => {
    byCategory[row._id] = row.count;
  });

  res.json({
    success: true,
    dashboard: {
      byStatus,
      byCategory,
      overdueCount: unresolved.filter(isComplaintOverdue).length
    }
  });
});
