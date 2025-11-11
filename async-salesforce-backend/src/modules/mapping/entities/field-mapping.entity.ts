import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { TFieldMapping } from '@app/shared/models/mapping.model';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { ObjectMappingEntity } from './object-mapping.entity';

@Entity('field_mappings')
@Unique(['objectMappingId', 'sfFieldApiName'])
@Index('idx_fieldmap_objmap', ['objectMappingId'])
export class FieldMappingEntity extends BaseEntity implements TFieldMapping {
  @Column({ type: 'uuid', nullable: false })
  objectMappingId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  sfFieldApiName!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  targetColumn!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  logicalType!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  targetTypeOverride?: string;

  // relations
  @ManyToOne(() => ObjectMappingEntity, (mapping) => mapping.fieldMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'object_mapping_id' })
  objectMapping!: ObjectMappingEntity;
}
