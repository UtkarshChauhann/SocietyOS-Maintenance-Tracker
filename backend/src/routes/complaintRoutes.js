import express from 'express';
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintOptions,
  getDashboard,
  getMyComplaints,
  updateComplaint
} from '../controllers/complaintController.js';
import { authorize, requireAuth } from '../middleware/auth.js';
import { uploadComplaintPhoto } from '../middleware/upload.js';

export const complaintRoutes = express.Router();

complaintRoutes.get('/options', requireAuth, getComplaintOptions);
complaintRoutes.get('/dashboard', requireAuth, authorize('admin'), getDashboard);
complaintRoutes.get('/complaints/me', requireAuth, authorize('resident'), getMyComplaints);
complaintRoutes.get('/complaints', requireAuth, authorize('admin'), getAllComplaints);
complaintRoutes.post('/complaints', requireAuth, authorize('resident'), uploadComplaintPhoto, createComplaint);
complaintRoutes.get('/complaints/:id', requireAuth, getComplaintById);
complaintRoutes.put('/complaints/:id', requireAuth, authorize('admin'), updateComplaint);
