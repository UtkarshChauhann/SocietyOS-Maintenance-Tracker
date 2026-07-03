import mongoose from 'mongoose';
import { COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from './Complaint.js';

const complaintHistorySchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    oldStatus: {
      type: String,
      enum: COMPLAINT_STATUSES,
      default: null
    },
    newStatus: {
      type: String,
      enum: COMPLAINT_STATUSES,
      default: null
    },
    oldPriority: {
      type: String,
      enum: COMPLAINT_PRIORITIES,
      default: null
    },
    newPriority: {
      type: String,
      enum: COMPLAINT_PRIORITIES,
      default: null
    },
    note: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    }
  },
  { timestamps: true }
);

complaintHistorySchema.index({ complaint: 1, createdAt: -1 });

export const ComplaintHistory = mongoose.model('ComplaintHistory', complaintHistorySchema);
