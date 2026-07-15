import { connectDb } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ensureGeneralSociety } from '../services/societyService.js';

const seedAdmin = async () => {
  const name = process.env.ADMIN_NAME || 'Society Admin';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  }

  await connectDb();
  const society = await ensureGeneralSociety();
  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    existing.name = name;
    existing.role = 'admin';
    existing.societyId = existing.societyId || society._id;
    if (password) {
      existing.passwordHash = await User.hashPassword(password);
    }
    await existing.save();
    console.log(`Updated admin user: ${email}`);
  } else {
    await User.create({
      name,
      email,
      role: 'admin',
      passwordHash: await User.hashPassword(password),
      societyId: society._id
    });
    console.log(`Created admin user: ${email}`);
  }

  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
