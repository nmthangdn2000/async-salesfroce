import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class RoleRepository extends BaseRepository<RoleEntity> {
  constructor(dataSource: DataSource) {
    super(RoleEntity, dataSource.createEntityManager());
  }
}
