import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from 'src/modules/role/entities/role.entity';

import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
})
export class RoleModule {}
