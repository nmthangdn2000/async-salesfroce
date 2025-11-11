import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { TargetEntity } from './entities/target.entity';

@Injectable()
export class TargetRepository extends BaseRepository<TargetEntity> {
  constructor(dataSource: DataSource) {
    super(TargetEntity, dataSource.createEntityManager());
  }
}
