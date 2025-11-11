import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ObjectMappingEntity } from './entities/object-mapping.entity';

@Injectable()
export class MappingRepository extends BaseRepository<ObjectMappingEntity> {
  constructor(dataSource: DataSource) {
    super(ObjectMappingEntity, dataSource.createEntityManager());
  }
}
