import { BaseRepository } from '@app/common/base/repository.base';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ProjectMemberEntity } from './entities/project-member.entity';

@Injectable()
export class ProjectMemberRepository extends BaseRepository<ProjectMemberEntity> {
  constructor(dataSource: DataSource) {
    super(ProjectMemberEntity, dataSource.createEntityManager());
  }
}

