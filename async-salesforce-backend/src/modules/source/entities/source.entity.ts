import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import {
  SOURCE_ENVIRONMENT,
  SOURCE_PROVIDER,
  SOURCE_STATUS,
  TSource,
} from '@app/shared/models/source.model';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { SfObjectsCatalogEntity } from '../../catalog/entities/sf-objects-catalog.entity';
import { ObjectMappingEntity } from '../../mapping/entities/object-mapping.entity';
import { ProjectEntity } from '../../project/entities/project.entity';
import { SourceSettingEntity } from '../../source-setting/entities/source-setting.entity';
import { TargetEntity } from '../../target/entities/target.entity';
import { SyncJobEntity } from '../../sync/entities/sync-job.entity';

@Entity('sources')
@Index('idx_sources_project', ['projectId'])
@Index('idx_sources_project_status', ['projectId', 'status'])
@Index('idx_sources_project_env', ['projectId', 'environment'])
export class SourceEntity extends BaseEntity implements TSource {
  @Column({ type: 'uuid', nullable: false })
  projectId!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  provider!: SOURCE_PROVIDER;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: SOURCE_ENVIRONMENT.PROD,
  })
  environment!: SOURCE_ENVIRONMENT;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: SOURCE_STATUS.ACTIVE,
  })
  status!: SOURCE_STATUS;

  // relations
  @ManyToOne(() => ProjectEntity, (project) => project.sources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

  @OneToOne(() => SourceSettingEntity, (setting) => setting.source, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sourceSetting?: SourceSettingEntity;

  @OneToMany(() => SfObjectsCatalogEntity, (catalog) => catalog.source, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sfObjectsCatalog!: SfObjectsCatalogEntity[];

  @OneToMany(() => ObjectMappingEntity, (mapping) => mapping.source, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  objectMappings!: ObjectMappingEntity[];

  @OneToMany(() => SyncJobEntity, (job) => job.source, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  syncJobs!: SyncJobEntity[];

  @OneToOne(() => TargetEntity, (target) => target.source, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  target!: TargetEntity;
}
