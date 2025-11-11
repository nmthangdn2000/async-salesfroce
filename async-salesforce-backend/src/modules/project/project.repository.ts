import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor(dataSource: DataSource) {
    super(ProjectEntity, dataSource.createEntityManager());
  }
}
