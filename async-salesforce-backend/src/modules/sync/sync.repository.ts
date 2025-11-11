import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { SyncJobEntity } from './entities/sync-job.entity';

@Injectable()
export class SyncRepository extends BaseRepository<SyncJobEntity> {
  constructor(dataSource: DataSource) {
    super(SyncJobEntity, dataSource.createEntityManager());
  }
}
