import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { ensureGeneralSociety } from './services/societyService.js';

const start = async () => {
  try {
    await connectDb();
    await ensureGeneralSociety();
    app.listen(env.port, () => {
      console.log(`[server] API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('[server] Failed to start', error);
    process.exit(1);
  }
};

start();
