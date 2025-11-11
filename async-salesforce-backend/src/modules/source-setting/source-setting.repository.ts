import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { SourceSettingEntity } from './entities/source-setting.entity';

@Injectable()
export class SourceSettingRepository extends BaseRepository<SourceSettingEntity> {
  constructor(dataSource: DataSource) {
    super(SourceSettingEntity, dataSource.createEntityManager());
  }
}
