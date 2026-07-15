import express from 'express';
import { login, me, register, registerSociety } from '../controllers/authController.js';
import { getGeneralSociety } from '../controllers/societyController.js';
import { requireAuth } from '../middleware/auth.js';
import { forgotPassword, resetPassword, verifyOtp } from '../controllers/passwordResetController.js';

export const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/societies/register', registerSociety);
authRoutes.get('/societies/general', getGeneralSociety);
authRoutes.post('/login', login);
authRoutes.get('/me', requireAuth, me);
authRoutes.post('/auth/forgot-password', forgotPassword);
authRoutes.post('/auth/verify-otp', verifyOtp);
authRoutes.post('/auth/reset-password', resetPassword);
