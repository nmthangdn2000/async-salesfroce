import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { FieldMappingEntity } from './entities/field-mapping.entity';

@Injectable()
export class FieldMappingRepository extends BaseRepository<FieldMappingEntity> {
  constructor(dataSource: DataSource) {
    super(FieldMappingEntity, dataSource.createEntityManager());
  }
}

