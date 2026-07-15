import { Society } from '../models/Society.js';
import { User } from '../models/User.js';
import { Complaint } from '../models/Complaint.js';
import { ComplaintHistory } from '../models/ComplaintHistory.js';
import { Notice } from '../models/Notice.js';

export const GENERAL_SOCIETY_CODE = 'GENERAL-DEMO';

export const ensureGeneralSociety = async () => {
  let society = await Society.findOne({ joiningCode: GENERAL_SOCIETY_CODE });
  if (!society) {
    society = await Society.create({ name: 'General Society', joiningCode: GENERAL_SOCIETY_CODE });
  }
  if (!society.isActive) {
    society.isActive = true;
    await society.save();
  }

  await User.updateMany({ societyId: { $exists: false } }, { $set: { societyId: society._id } });
  await Complaint.updateMany({ societyId: { $exists: false } }, { $set: { societyId: society._id } });
  await Notice.updateMany({ societyId: { $exists: false } }, { $set: { societyId: society._id } });
  await ComplaintHistory.updateMany({ societyId: { $exists: false } }, { $set: { societyId: society._id } });
  return society;
};
