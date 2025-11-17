import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { SfFieldsCatalogEntity } from './entities/sf-fields-catalog.entity';

@Injectable()
export class SfFieldsCatalogRepository extends BaseRepository<SfFieldsCatalogEntity> {
  constructor(dataSource: DataSource) {
    super(SfFieldsCatalogEntity, dataSource.createEntityManager());
  }
}

