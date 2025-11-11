import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { SYNC_JOB_STATUS, TSyncJob } from '@app/shared/models/sync.model';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { SourceEntity } from '../../source/entities/source.entity';
import { TargetEntity } from '../../target/entities/target.entity';
import { SyncRunEntity } from './sync-run.entity';

@Entity('sync_jobs')
@Index('idx_jobs_source_target', ['sourceId', 'targetId'])
@Index('idx_jobs_status', ['status'])
export class SyncJobEntity extends BaseEntity implements TSyncJob {
  @Column({ type: 'uuid', nullable: false })
  sourceId!: string;

  @Column({ type: 'uuid', nullable: false })
  targetId!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  type!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  scheduleCron?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: SYNC_JOB_STATUS.IDLE,
  })
  status!: SYNC_JOB_STATUS;

  @Column({ type: 'timestamptz', nullable: true })
  lastRunAt?: Date;

  // relations
  @ManyToOne(() => SourceEntity, (source) => source.syncJobs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'source_id' })
  source!: SourceEntity;

  @ManyToOne(() => TargetEntity, (target) => target.syncJobs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'target_id' })
  target!: TargetEntity;

  @OneToMany(() => SyncRunEntity, (run) => run.job, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  syncRuns!: SyncRunEntity[];
}
