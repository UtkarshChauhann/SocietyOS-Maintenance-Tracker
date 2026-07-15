import { asyncHandler } from '../utils/asyncHandler.js';
import { Society } from '../models/Society.js';
import { GENERAL_SOCIETY_CODE } from '../services/societyService.js';

export const getGeneralSociety = asyncHandler(async (_req, res) => {
  const society = await Society.findOne({ joiningCode: GENERAL_SOCIETY_CODE, isActive: true }).select('name joiningCode');
  res.json({ success: true, society });
});
