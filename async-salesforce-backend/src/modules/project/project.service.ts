import { stringToSlug } from '@app/common';
import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateProjectRequestDto } from 'src/modules/project/dto/requests/create-project.dto';
import { FilterProjectRequestDto } from 'src/modules/project/dto/requests/filter-project.dto';
import { GetPaginatedProjectResponseDto } from 'src/modules/project/dto/response/get-all-project.dto';
import { GetOneProjectResponseDto } from 'src/modules/project/dto/response/get-one-project.dto';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';

import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(
    createProjectDto: CreateProjectRequestDto,
  ): Promise<ProjectEntity> {
    const project = this.projectRepository.create({
      name: createProjectDto.name,
      slug: stringToSlug(createProjectDto.name),
    });

    return this.projectRepository.save(project);
  }

  async findBySlug(slug: string): Promise<GetOneProjectResponseDto> {
    const project = await this.projectRepository.findOne({ where: { slug } });

    if (!project) {
      throw new CustomHttpException(ERROR_MESSAGES.ProjectNotFound);
    }

    return plainToInstance(GetOneProjectResponseDto, project);
  }

  async findAll(
    filter: FilterProjectRequestDto,
  ): Promise<GetPaginatedProjectResponseDto> {
    const query = this.projectRepository.createQueryBuilder('project');

    const result = await this.projectRepository.paginate(
      query,
      filter,
      GetOneProjectResponseDto,
    );

    return plainToInstance(GetPaginatedProjectResponseDto, result);
  }
}
