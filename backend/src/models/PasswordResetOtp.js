import mongoose from 'mongoose';

const passwordResetOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    otpHash: { type: String, default: null },
    expiresAt: { type: Date, required: true, index: true },
    attempts: { type: Number, default: 0 },
    lastSentAt: { type: Date, required: true },
    resetTokenHash: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null }
  },
  { timestamps: true }
);

passwordResetOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetOtp = mongoose.model('PasswordResetOtp', passwordResetOtpSchema);
