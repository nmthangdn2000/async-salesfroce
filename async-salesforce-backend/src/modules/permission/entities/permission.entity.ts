import { TPermission } from '@app/shared/models/permission.model';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('permissions')
export class PermissionEntity implements TPermission {
  @PrimaryColumn({ type: 'int' })
  code!: number;

  @Column({ type: 'varchar', length: 50 })
  key!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Column({ type: 'varchar', length: 20 })
  module!: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles!: RoleEntity[];

  @ManyToMany(() => UserEntity, (user) => user.permissions)
  users!: UserEntity[];
}
