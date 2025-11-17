import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { SfObjectsCatalogEntity } from './entities/sf-objects-catalog.entity';

@Injectable()
export class SfObjectsCatalogRepository extends BaseRepository<SfObjectsCatalogEntity> {
  constructor(dataSource: DataSource) {
    super(SfObjectsCatalogEntity, dataSource.createEntityManager());
  }
}
