import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { SourceEntity } from './entities/source.entity';

@Injectable()
export class SourceRepository extends BaseRepository<SourceEntity> {
  constructor(dataSource: DataSource) {
    super(SourceEntity, dataSource.createEntityManager());
  }
}
