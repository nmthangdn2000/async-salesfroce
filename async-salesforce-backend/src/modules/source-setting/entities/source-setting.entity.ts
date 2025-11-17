import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { AUTH_TYPE, TSourceSetting } from '@app/shared/models/source.model';
import { Column, Entity, Index, JoinColumn, OneToOne, Unique } from 'typeorm';

import { SourceEntity } from '../../source/entities/source.entity';

@Entity('source_setting')
@Unique(['sourceId'])
@Index('idx_source_setting_source', ['sourceId'])
export class SourceSettingEntity extends BaseEntity implements TSourceSetting {
  @Column({ type: 'uuid', nullable: false, unique: true })
  sourceId!: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  instanceUrl!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: AUTH_TYPE.OAUTH2,
  })
  authType!: AUTH_TYPE;

  @Column({ type: 'text', array: true, nullable: true })
  scopes?: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  secretsRef?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  clientId?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  clientSecret?: string;

  @Column({ type: 'text', nullable: true })
  refreshToken?: string;

  @Column({ type: 'text', nullable: true })
  accessToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  // relations
  @OneToOne(() => SourceEntity, (source) => source.sourceSetting, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'source_id' })
  source!: SourceEntity;
}
