import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { TTargetConnection } from '@app/shared/models/target.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { TargetEntity } from './target.entity';

@Entity('target_connections')
@Index('idx_target_connections_target', ['targetId'])
export class TargetConnectionEntity
  extends BaseEntity
  implements TTargetConnection
{
  @Column({ type: 'uuid', nullable: false })
  targetId!: string;

  @Column({ type: 'jsonb', nullable: false })
  connectInfo!: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: false })
  secretsRef!: string;

  // relations
  @ManyToOne(() => TargetEntity, (target) => target.targetConnections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'target_id' })
  target!: TargetEntity;
}
