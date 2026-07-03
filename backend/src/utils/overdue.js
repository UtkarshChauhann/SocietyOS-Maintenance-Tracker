import { env } from '../config/env.js';

export const isComplaintOverdue = (complaint) => {
  if (!complaint || complaint.status === 'Resolved') return false;
  const createdAt = new Date(complaint.createdAt).getTime();
  const ageMs = Date.now() - createdAt;
  return ageMs > env.overdueThresholdDays * 24 * 60 * 60 * 1000;
};

export const attachOverdue = (complaint) => {
  const plain = complaint.toObject ? complaint.toObject() : complaint;
  return { ...plain, isOverdue: isComplaintOverdue(plain) };
};
