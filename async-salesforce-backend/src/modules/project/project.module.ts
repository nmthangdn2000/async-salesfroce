import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMemberModule } from '../project-member/project-member.module';
import { ProjectEntity } from './entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity]),
    ProjectMemberModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectRepository, ProjectService],
})
export class ProjectModule {}
