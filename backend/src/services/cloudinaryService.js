import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const configured = Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);

if (configured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret
  });
}

export const uploadComplaintPhoto = (file) => {
  if (!configured) throw new AppError('Image uploads are not configured', 503);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'nestra/complaints', resource_type: 'image' },
      (error, result) => (error ? reject(new AppError('Image upload failed', 502)) : resolve(result))
    );
    stream.end(file.buffer);
  });
};
