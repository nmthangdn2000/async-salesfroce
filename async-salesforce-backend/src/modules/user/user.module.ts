import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionRepository } from 'src/modules/permission/permission.repository';
import { RoleRepository } from 'src/modules/role/role.repository';
import { UserRepository } from 'src/modules/user/user.repository';

import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RoleRepository,
    PermissionRepository,
  ],
})
export class UserModule {}
