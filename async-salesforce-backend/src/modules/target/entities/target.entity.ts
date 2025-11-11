import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { TARGET_KIND, TTarget } from '@app/shared/models/target.model';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { ObjectMappingEntity } from '../../mapping/entities/object-mapping.entity';
import { ProjectEntity } from '../../project/entities/project.entity';
import { SyncJobEntity } from '../../sync/entities/sync-job.entity';
import { TargetConnectionEntity } from './target-connection.entity';

@Entity('targets')
@Index('idx_targets_project', ['projectId'])
export class TargetEntity extends BaseEntity implements TTarget {
  @Column({ type: 'uuid', nullable: false })
  projectId!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  kind!: TARGET_KIND;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  // relations
  @ManyToOne(() => ProjectEntity, (project) => project.targets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

  @OneToMany(() => TargetConnectionEntity, (connection) => connection.target, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  targetConnections!: TargetConnectionEntity[];

  @OneToMany(() => ObjectMappingEntity, (mapping) => mapping.target, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  objectMappings!: ObjectMappingEntity[];

  @OneToMany(() => SyncJobEntity, (job) => job.target, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  syncJobs!: SyncJobEntity[];
}
