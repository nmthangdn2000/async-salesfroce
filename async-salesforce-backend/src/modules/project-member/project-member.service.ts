import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateProjectMemberRequestDto } from 'src/modules/project-member/dto/requests/create-project-member.dto';
import { FilterProjectMemberRequestDto } from 'src/modules/project-member/dto/requests/filter-project-member.dto';
import { GetPaginatedProjectMemberResponseDto } from 'src/modules/project-member/dto/response/get-all-project-member.dto';
import { GetOneProjectMemberResponseDto } from 'src/modules/project-member/dto/response/get-one-project-member.dto';
import { ProjectMemberEntity } from 'src/modules/project-member/entities/project-member.entity';

import { ProjectMemberRepository } from './project-member.repository';

@Injectable()
export class ProjectMemberService {
  constructor(
    private readonly projectMemberRepository: ProjectMemberRepository,
  ) {}

  async create(
    createProjectMemberDto: CreateProjectMemberRequestDto,
  ): Promise<GetOneProjectMemberResponseDto> {
    // Check if member already exists
    const existingMember = await this.projectMemberRepository.findOne({
      where: {
        projectId: createProjectMemberDto.projectId,
        userId: createProjectMemberDto.userId,
      },
    });

    if (existingMember) {
      throw new CustomHttpException(ERROR_MESSAGES.ProjectMemberAlreadyExists);
    }

    const projectMember = this.projectMemberRepository.create({
      projectId: createProjectMemberDto.projectId,
      userId: createProjectMemberDto.userId,
      role: createProjectMemberDto.role,
    });

    const savedMember = await this.projectMemberRepository.save(projectMember);
    
    // Fetch with relations to return complete data
    const memberWithRelations = await this.projectMemberRepository.findOne({
      where: { id: savedMember.id },
      relations: ['user', 'user.profile'],
    });

    return plainToInstance(GetOneProjectMemberResponseDto, memberWithRelations);
  }

  async findById(id: string): Promise<GetOneProjectMemberResponseDto> {
    const projectMember = await this.projectMemberRepository.findOne({
      where: { id },
      relations: ['project', 'user', 'user.profile'],
    });

    if (!projectMember) {
      throw new CustomHttpException(ERROR_MESSAGES.ProjectMemberNotFound);
    }

    return plainToInstance(GetOneProjectMemberResponseDto, projectMember);
  }

  async findAll(
    filter: FilterProjectMemberRequestDto,
  ): Promise<GetPaginatedProjectMemberResponseDto> {
    const query =
      this.projectMemberRepository.createQueryBuilder('projectMember')
        .leftJoinAndSelect('projectMember.user', 'user')
        .leftJoinAndSelect('user.profile', 'profile');

    if (filter.projectId) {
      query.andWhere('projectMember.projectId = :projectId', {
        projectId: filter.projectId,
      });
    }

    if (filter.userId) {
      query.andWhere('projectMember.userId = :userId', {
        userId: filter.userId,
      });
    }

    if (filter.role) {
      query.andWhere('projectMember.role = :role', {
        role: filter.role,
      });
    }

    const result = await this.projectMemberRepository.paginate(
      query,
      filter,
      GetOneProjectMemberResponseDto,
    );

    return plainToInstance(GetPaginatedProjectMemberResponseDto, result);
  }

  async remove(id: string): Promise<void> {
    const projectMember = await this.projectMemberRepository.findOne({
      where: { id },
    });

    if (!projectMember) {
      throw new CustomHttpException(ERROR_MESSAGES.ProjectMemberNotFound);
    }

    await this.projectMemberRepository.remove(projectMember);
  }
}
