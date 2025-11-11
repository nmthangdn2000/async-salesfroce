import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { SYNC_RUN_STATUS, TSyncRun } from '@app/shared/models/sync.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { SyncJobEntity } from './sync-job.entity';

@Entity('sync_runs')
@Index('idx_runs_job_time', ['jobId', 'startedAt'])
@Index('idx_runs_job', ['jobId'])
@Index('idx_runs_status_time', ['status', 'startedAt'])
export class SyncRunEntity extends BaseEntity implements TSyncRun {
  @Column({ type: 'uuid', nullable: false })
  jobId!: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  startedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finishedAt?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status?: SYNC_RUN_STATUS;

  @Column({ type: 'jsonb', nullable: true })
  metrics?: Record<string, any>;

  // relations
  @ManyToOne(() => SyncJobEntity, (job) => job.syncRuns, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_id' })
  job!: SyncJobEntity;
}
