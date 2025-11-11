import { Injectable } from '@nestjs/common';
import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PermissionRepository extends Repository<PermissionEntity> {
  constructor(dataSource: DataSource) {
    super(PermissionEntity, dataSource.createEntityManager());
  }
}
