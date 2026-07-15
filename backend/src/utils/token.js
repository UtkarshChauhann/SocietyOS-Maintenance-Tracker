import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, societyId: user.societyId?._id || user.societyId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
