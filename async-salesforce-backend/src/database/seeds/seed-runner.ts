import ormconfig from '../ormconfig';
import { Seeder } from './index';

const run = async () => {
  const dataSource = await ormconfig;

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const seeder = new Seeder(dataSource);
  await seeder.run();

  await dataSource.destroy();
  process.exit(0);
};

run().catch((error) => {
  console.error('Failed to run seeds:', error);
  process.exit(1);
});
