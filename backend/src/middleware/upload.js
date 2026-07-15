import multer from 'multer';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const fileFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new AppError('Only image uploads are allowed', 400));
    return;
  }
  cb(null, true);
};

export const uploadComplaintPhoto = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: env.maxUploadSizeMb * 1024 * 1024
  }
}).single('photo');
