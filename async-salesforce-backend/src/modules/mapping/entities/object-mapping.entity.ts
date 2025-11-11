import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { PK_STRATEGY, TObjectMapping } from '@app/shared/models/mapping.model';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';

import { SourceEntity } from '../../source/entities/source.entity';
import { TargetEntity } from '../../target/entities/target.entity';
import { FieldMappingEntity } from './field-mapping.entity';

@Entity('object_mappings')
@Unique(['sourceId', 'objectApiName', 'targetId'])
@Index('idx_objmap_source', ['sourceId'])
@Index('idx_objmap_target', ['targetId'])
export class ObjectMappingEntity extends BaseEntity implements TObjectMapping {
  @Column({ type: 'uuid', nullable: false })
  sourceId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  objectApiName!: string;

  @Column({ type: 'uuid', nullable: false })
  targetId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  targetTable!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: PK_STRATEGY.SF_ID,
  })
  pkStrategy!: PK_STRATEGY;

  // relations
  @ManyToOne(() => SourceEntity, (source) => source.objectMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'source_id' })
  source!: SourceEntity;

  @ManyToOne(() => TargetEntity, (target) => target.objectMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'target_id' })
  target!: TargetEntity;

  @OneToMany(() => FieldMappingEntity, (field) => field.objectMapping, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  fieldMappings!: FieldMappingEntity[];
}
