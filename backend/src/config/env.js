import dotenv from 'dotenv';

dotenv.config();

const required = ['JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[config] Missing ${key}. Set it in backend/.env before running production.`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/society_maintenance_tracker',
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  overdueThresholdDays: Number(process.env.OVERDUE_THRESHOLD_DAYS || 3),
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB || 5),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM
  }
};
