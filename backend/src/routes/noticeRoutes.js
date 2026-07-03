import express from 'express';
import { createNotice, getNotices } from '../controllers/noticeController.js';
import { authorize, requireAuth } from '../middleware/auth.js';

export const noticeRoutes = express.Router();

noticeRoutes.get('/notices', requireAuth, getNotices);
noticeRoutes.post('/notices', requireAuth, authorize('admin'), createNotice);
