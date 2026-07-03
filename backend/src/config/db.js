import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDb = async () => {
  mongoose.set('strictQuery', true);
  let mongoUri = env.mongoUri;

  if (!process.env.MONGODB_URI && env.nodeEnv === 'development') {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri();
    globalThis.__mongoMemoryServer = memoryServer;
    console.log('[db] Using in-memory MongoDB for local development');
  }

  await mongoose.connect(mongoUri);
  console.log('[db] MongoDB connected');
};
