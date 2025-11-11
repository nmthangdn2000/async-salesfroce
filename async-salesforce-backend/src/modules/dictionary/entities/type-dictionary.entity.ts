import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { TTypeDictionary } from '@app/shared/models/dictionary.model';
import { Column, Entity, Index, Unique } from 'typeorm';

@Entity('type_dictionary')
@Index('idx_typedict_sf_type', ['sfType'])
@Unique(['sfType', 'logicalType'])
export class TypeDictionaryEntity
  extends BaseEntity
  implements TTypeDictionary
{
  @Column({ type: 'varchar', length: 100, nullable: false })
  sfType!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  logicalType!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pgType?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mysqlType?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sqlserverType?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bigqueryType?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  snowflakeType?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  clickhouseType?: string;
}
