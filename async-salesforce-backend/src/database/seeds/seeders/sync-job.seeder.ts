import { SYNC_JOB_STATUS } from '@app/shared/models/sync.model';
import { randomUUID } from 'crypto';
import { SourceEntity } from 'src/modules/source/entities/source.entity';
import { SyncJobEntity } from 'src/modules/sync/entities/sync-job.entity';
import { TargetEntity } from 'src/modules/target/entities/target.entity';
import { DataSource } from 'typeorm';

export async function seedSyncJobs(
  dataSource: DataSource,
  sources: SourceEntity[],
  targets: TargetEntity[],
): Promise<SyncJobEntity[]> {
  console.log('⚡ Seeding sync jobs...');
  const repository = dataSource.getRepository(SyncJobEntity);

  const syncJobs = [
    {
      id: randomUUID(),
      sourceId: sources[0].id,
      targetId: targets[0].id,
      type: 'full',
      scheduleCron: '0 2 * * *', // Daily at 2 AM
      status: SYNC_JOB_STATUS.IDLE,
      lastRunAt: undefined,
    },
    {
      id: randomUUID(),
      sourceId: sources[0].id,
      targetId: targets[1].id,
      type: 'incremental',
      scheduleCron: '0 */6 * * *', // Every 6 hours
      status: SYNC_JOB_STATUS.IDLE,
      lastRunAt: undefined,
    },
    {
      id: randomUUID(),
      sourceId: sources[1].id,
      targetId: targets[0].id,
      type: 'full',
      scheduleCron: '0 3 * * *', // Daily at 3 AM
      status: SYNC_JOB_STATUS.PAUSED,
      lastRunAt: new Date(Date.now() - 86400000), // Yesterday
    },
  ];

  const savedJobs = await repository.save(syncJobs);
  return savedJobs;
}
