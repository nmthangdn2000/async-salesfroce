import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { TProfile } from '@app/shared/models/profile.model';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, JoinColumn, OneToOne } from 'typeorm';
import { Entity } from 'typeorm';

@Entity('profiles')
export class ProfileEntity extends BaseEntity implements TProfile {
  @Column({ type: 'uuid', nullable: false })
  userId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  dob?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bio?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  // relations
  @OneToOne(() => UserEntity, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
