import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectMemberRequestDto } from 'src/modules/project-member/dto/requests/create-project-member.dto';
import { FilterProjectMemberRequestDto } from 'src/modules/project-member/dto/requests/filter-project-member.dto';
import { GetPaginatedProjectMemberResponseDto } from 'src/modules/project-member/dto/response/get-all-project-member.dto';
import { GetOneProjectMemberResponseDto } from 'src/modules/project-member/dto/response/get-one-project-member.dto';
import { ProjectMemberEntity } from 'src/modules/project-member/entities/project-member.entity';

import { ProjectMemberService } from './project-member.service';

@ApiTags('Project Members')
@Controller('project-members')
export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project member' })
  @ApiResponse({
    status: 201,
    description: 'The project member has been successfully created.',
    type: GetOneProjectMemberResponseDto,
  })
  @ApiBody({ type: CreateProjectMemberRequestDto })
  async create(
    @Body() createProjectMemberDto: CreateProjectMemberRequestDto,
  ): Promise<ProjectMemberEntity> {
    return this.projectMemberService.create(createProjectMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all project members' })
  @ApiResponse({
    status: 200,
    description: 'The project members have been successfully retrieved.',
    type: GetPaginatedProjectMemberResponseDto,
  })
  async findAll(
    @Query() filter: FilterProjectMemberRequestDto,
  ): Promise<GetPaginatedProjectMemberResponseDto> {
    return this.projectMemberService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project member by id' })
  @ApiResponse({
    status: 200,
    description: 'The project member has been successfully retrieved.',
    type: GetOneProjectMemberResponseDto,
  })
  async findById(
    @Param('id') id: string,
  ): Promise<GetOneProjectMemberResponseDto> {
    return this.projectMemberService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project member' })
  @ApiResponse({
    status: 200,
    description: 'The project member has been successfully deleted.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectMemberService.remove(id);
  }
}
