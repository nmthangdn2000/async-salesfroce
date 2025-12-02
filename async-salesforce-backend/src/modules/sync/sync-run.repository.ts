import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { SyncRunEntity } from './entities/sync-run.entity';

@Injectable()
export class SyncRunRepository extends BaseRepository<SyncRunEntity> {
  constructor(dataSource: DataSource) {
    super(SyncRunEntity, dataSource.createEntityManager());
  }
}

