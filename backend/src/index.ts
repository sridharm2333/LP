import { connectDb } from './db/connection';
import { config } from './config';
import app from './app';
import { seedGroups } from './seed/groups';

async function main() {
  await connectDb();
  await seedGroups();
  app.listen(config.port, () => {
    console.log(`Lonely Penguin API running on port ${config.port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
