import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }
}
