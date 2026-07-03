import mongoose from 'mongoose';

export const COMPLAINT_STATUSES = ['Open', 'In Progress', 'Resolved'];
export const COMPLAINT_PRIORITIES = ['Low', 'Medium', 'High'];
export const COMPLAINT_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Security',
  'Lift',
  'Parking',
  'Other'
];

const complaintSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: COMPLAINT_CATEGORIES,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: 10,
      maxlength: 2000
    },
    photoUrl: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: COMPLAINT_STATUSES,
      default: 'Open',
      index: true
    },
    priority: {
      type: String,
      enum: COMPLAINT_PRIORITIES,
      default: 'Low',
      index: true
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ status: 1, category: 1, priority: 1, createdAt: -1 });

export const Complaint = mongoose.model('Complaint', complaintSchema);
