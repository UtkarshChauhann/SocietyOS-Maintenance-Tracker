import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: 10,
      maxlength: 3000
    },
    isImportant: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

noticeSchema.index({ isImportant: -1, createdAt: -1 });

export const Notice = mongoose.model('Notice', noticeSchema);
