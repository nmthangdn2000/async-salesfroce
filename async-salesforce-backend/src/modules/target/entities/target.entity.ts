import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { TARGET_KIND, TTarget, CONNECTION_TYPE } from '@app/shared/models/target.model';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { ObjectMappingEntity } from '../../mapping/entities/object-mapping.entity';
import { ProjectEntity } from '../../project/entities/project.entity';
import { SourceEntity } from '../../source/entities/source.entity';
import { SyncJobEntity } from '../../sync/entities/sync-job.entity';

@Entity('targets')
@Index('idx_targets_project', ['projectId'])
@Index('idx_targets_source', ['sourceId'])
export class TargetEntity extends BaseEntity implements TTarget {
  @Column({ type: 'uuid', nullable: false })
  projectId!: string;

  @Column({ type: 'uuid', nullable: false })
  sourceId!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  kind!: TARGET_KIND;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'host',
  })
  connectionType!: CONNECTION_TYPE;

  // Database connection fields
  @Column({ type: 'varchar', length: 255, nullable: true })
  host?: string;

  @Column({ type: 'integer', nullable: true })
  port?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  database?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  schema?: string;

  @Column({ type: 'boolean', default: false })
  ssl!: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sslMode?: string;

  @Column({ type: 'text', nullable: true })
  connectionString?: string;

  // relations
  @ManyToOne(() => ProjectEntity, (project) => project.targets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

  @OneToOne(() => SourceEntity, (source) => source.target, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'source_id' })
  source!: SourceEntity;

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
