import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { TypeDictionaryEntity } from './entities/type-dictionary.entity';

@Injectable()
export class DictionaryRepository extends BaseRepository<TypeDictionaryEntity> {
  constructor(dataSource: DataSource) {
    super(TypeDictionaryEntity, dataSource.createEntityManager());
  }
}
