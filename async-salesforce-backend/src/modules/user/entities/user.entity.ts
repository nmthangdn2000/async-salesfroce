import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { TUser, USER_STATUS } from '@app/shared/models/user.model';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Column } from 'typeorm';
import { Entity } from 'typeorm';

import { ProfileEntity } from './profile.entity';

@Entity('users')
export class UserEntity extends BaseEntity implements TUser {
  @Column({ type: 'varchar', length: 255, nullable: false })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password!: string;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  profile!: ProfileEntity;

  @Column({ type: 'varchar', length: 20, default: USER_STATUS.ACTIVE })
  status!: USER_STATUS;

  // relations
  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles!: RoleEntity[];

  @ManyToMany(() => PermissionEntity, (permission) => permission.users)
  @JoinTable({
    name: 'user_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_code',
      referencedColumnName: 'code',
    },
  })
  permissions!: PermissionEntity[];

  @OneToMany(() => FileEntity, (file) => file.user, {
    onDelete: 'SET NULL',
  })
  files!: FileEntity[];
}
