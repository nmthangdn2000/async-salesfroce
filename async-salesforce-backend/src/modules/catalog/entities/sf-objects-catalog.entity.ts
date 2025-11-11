import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { TSfObjectsCatalog } from '@app/shared/models/catalog.model';
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
import { SfFieldsCatalogEntity } from './sf-fields-catalog.entity';

@Entity('sf_objects_catalog')
@Unique(['sourceId', 'apiName'])
@Index('idx_sf_objects_source', ['sourceId'])
@Index('idx_sf_objects_selected', ['sourceId', 'isSelected'])
export class SfObjectsCatalogEntity
  extends BaseEntity
  implements TSfObjectsCatalog
{
  @Column({ type: 'uuid', nullable: false })
  sourceId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  apiName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  label?: string;

  @Column({ type: 'boolean', default: false })
  isSelected!: boolean;

  @Column({ type: 'uuid', nullable: true })
  selectedBy?: string;

  @Column({ type: 'timestamptz', nullable: true })
  selectedAt?: Date;

  // relations
  @ManyToOne(() => SourceEntity, (source) => source.sfObjectsCatalog, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'source_id' })
  source!: SourceEntity;

  @OneToMany(() => SfFieldsCatalogEntity, (field) => field.object, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sfFieldsCatalog!: SfFieldsCatalogEntity[];
}
