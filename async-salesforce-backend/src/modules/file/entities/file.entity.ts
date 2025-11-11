import { BaseEntity } from '@app/core/modules/typeorm-config/entities';
import { TFile } from '@app/shared/models/file.model';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'files' })
export class FileEntity extends BaseEntity implements TFile {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  path!: string;

  @Column({ type: 'int' })
  size!: number;

  @Column({ type: 'varchar', length: 255 })
  type!: string;

  @Column({ type: 'varchar', length: 255 })
  url!: string;

  @ManyToOne(() => UserEntity, (user) => user.files, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
