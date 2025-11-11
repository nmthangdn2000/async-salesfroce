import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectRequestDto } from 'src/modules/project/dto/requests/create-project.dto';
import { FilterProjectRequestDto } from 'src/modules/project/dto/requests/filter-project.dto';
import { GetPaginatedProjectResponseDto } from 'src/modules/project/dto/response/get-all-project.dto';
import { GetOneProjectResponseDto } from 'src/modules/project/dto/response/get-one-project.dto';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';

import { ProjectService } from './project.service';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
    type: GetOneProjectResponseDto,
  })
  @ApiBody({ type: CreateProjectRequestDto })
  async create(
    @Body() createProjectDto: CreateProjectRequestDto,
  ): Promise<ProjectEntity> {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: 200,
    description: 'The projects have been successfully retrieved.',
    type: GetPaginatedProjectResponseDto,
  })
  async findAll(
    @Query() filter: FilterProjectRequestDto,
  ): Promise<GetPaginatedProjectResponseDto> {
    return this.projectService.findAll(filter);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a project by slug' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully retrieved.',
    type: GetOneProjectResponseDto,
  })
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<GetOneProjectResponseDto> {
    return this.projectService.findBySlug(slug);
  }
}
