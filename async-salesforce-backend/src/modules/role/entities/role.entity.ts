import { BaseEntity } from '@app/core/modules/typeorm-config/entities';
import { TPermission } from '@app/shared/models/permission.model';
import { TRole } from '@app/shared/models/role.model';
import { TUser } from '@app/shared/models/user.model';
import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('roles')
export class RoleEntity extends BaseEntity implements TRole {
  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_code',
      referencedColumnName: 'code',
    },
  })
  permissions!: TPermission[];

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users!: TUser[];
}
