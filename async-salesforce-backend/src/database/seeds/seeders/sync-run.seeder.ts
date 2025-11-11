import { SYNC_RUN_STATUS } from '@app/shared/models/sync.model';
import { randomUUID } from 'crypto';
import { SyncJobEntity } from 'src/modules/sync/entities/sync-job.entity';
import { SyncRunEntity } from 'src/modules/sync/entities/sync-run.entity';
import { DataSource } from 'typeorm';

export async function seedSyncRuns(
  dataSource: DataSource,
  syncJobs: SyncJobEntity[],
): Promise<SyncRunEntity[]> {
  console.log('🏃 Seeding sync runs...');
  const repository = dataSource.getRepository(SyncRunEntity);

  const syncRuns: SyncRunEntity[] = [];

  for (const job of syncJobs) {
    // Create a few historical runs
    for (let i = 0; i < 3; i++) {
      const startedAt = new Date(Date.now() - (i + 1) * 86400000); // Days ago
      const finishedAt = new Date(startedAt.getTime() + 3600000); // 1 hour later
      const status =
        i === 0
          ? SYNC_RUN_STATUS.SUCCESS
          : i === 1
            ? SYNC_RUN_STATUS.FAILED
            : SYNC_RUN_STATUS.SUCCESS;

      syncRuns.push(
        repository.create({
          id: randomUUID(),
          jobId: job.id,
          startedAt,
          finishedAt,
          status,
          metrics: {
            recordsProcessed: Math.floor(Math.random() * 10000) + 1000,
            recordsFailed: i === 1 ? Math.floor(Math.random() * 100) : 0,
            duration: 3600,
          },
        }),
      );
    }
  }

  const savedRuns = await repository.save(syncRuns);
  return savedRuns;
}
