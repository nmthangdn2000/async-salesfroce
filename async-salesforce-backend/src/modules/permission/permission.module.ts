import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';

import { PermissionController } from './permission.controller';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
})
export class PermissionModule {}
