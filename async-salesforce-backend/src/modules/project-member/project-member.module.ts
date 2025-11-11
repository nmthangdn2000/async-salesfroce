import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMemberEntity } from './entities/project-member.entity';
import { ProjectMemberController } from './project-member.controller';
import { ProjectMemberRepository } from './project-member.repository';
import { ProjectMemberService } from './project-member.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMemberEntity])],
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService, ProjectMemberRepository],
  exports: [ProjectMemberRepository, ProjectMemberService],
})
export class ProjectMemberModule {}
