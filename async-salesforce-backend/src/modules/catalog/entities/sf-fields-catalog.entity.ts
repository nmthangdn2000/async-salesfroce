import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { TSfFieldsCatalog } from '@app/shared/models/catalog.model';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { SfObjectsCatalogEntity } from './sf-objects-catalog.entity';

@Entity('sf_fields_catalog')
@Unique(['objectId', 'apiName'])
@Index('idx_sf_fields_object', ['objectId'])
@Index('idx_sf_fields_selected', ['objectId', 'isSelected'])
export class SfFieldsCatalogEntity
  extends BaseEntity
  implements TSfFieldsCatalog
{
  @Column({ type: 'uuid', nullable: false })
  objectId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  apiName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  label?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  sfType!: string;

  @Column({ type: 'boolean', nullable: true })
  isRequired?: boolean;

  @Column({ type: 'int', nullable: true })
  length?: number;

  @Column({ type: 'int', nullable: true })
  precision?: number;

  @Column({ type: 'int', nullable: true })
  scale?: number;

  @Column({ type: 'boolean', default: false })
  isSelected!: boolean;

  @Column({ type: 'uuid', nullable: true })
  selectedBy?: string;

  @Column({ type: 'timestamptz', nullable: true })
  selectedAt?: Date;

  // relations
  @ManyToOne(() => SfObjectsCatalogEntity, (object) => object.sfFieldsCatalog, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'object_id' })
  object!: SfObjectsCatalogEntity;
}
