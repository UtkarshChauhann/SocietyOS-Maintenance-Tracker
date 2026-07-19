import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { authRoutes } from './routes/authRoutes.js';
import { complaintRoutes } from './routes/complaintRoutes.js';
import { noticeRoutes } from './routes/noticeRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allowedOrigins = new Set([
  'https://nestra-society.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  env.clientUrl
].filter(Boolean));

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Nestra API is running' });
});

app.use('/api', authRoutes);
app.use('/api', complaintRoutes);
app.use('/api', noticeRoutes);

app.use(notFound);
app.use(errorHandler);
