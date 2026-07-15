import crypto from 'crypto';
import mongoose from 'mongoose';

const societySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Society name is required'], trim: true, maxlength: 120 },
    joiningCode: { type: String, required: true, unique: true, index: true, trim: true, uppercase: true },
    address: { type: String, trim: true, maxlength: 300, default: '' },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

societySchema.statics.createJoiningCode = () => `SOC-${crypto.randomBytes(5).toString('base64url').toUpperCase()}`;

export const Society = mongoose.model('Society', societySchema);
