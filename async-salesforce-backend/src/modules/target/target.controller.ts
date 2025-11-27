import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTargetRequestDto } from 'src/modules/target/dto/requests/create-target.dto';
import { UpdateTargetRequestDto } from 'src/modules/target/dto/requests/update-target.dto';
import { FilterTargetRequestDto } from 'src/modules/target/dto/requests/filter-target.dto';
import { GetPaginatedTargetResponseDto } from 'src/modules/target/dto/response/get-all-target.dto';
import { GetOneTargetResponseDto } from 'src/modules/target/dto/response/get-one-target.dto';
import { TargetEntity } from 'src/modules/target/entities/target.entity';

import { TargetService } from './target.service';

@ApiTags('Targets')
@Controller('targets')
export class TargetController {
  constructor(private readonly targetService: TargetService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new target' })
  @ApiResponse({
    status: 201,
    description: 'The target has been successfully created.',
    type: GetOneTargetResponseDto,
  })
  @ApiBody({ type: CreateTargetRequestDto })
  async create(
    @Body() createTargetDto: CreateTargetRequestDto,
  ): Promise<TargetEntity> {
    return this.targetService.create(createTargetDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a target' })
  @ApiResponse({
    status: 200,
    description: 'The target has been successfully updated.',
    type: GetOneTargetResponseDto,
  })
  @ApiBody({ type: UpdateTargetRequestDto })
  async update(
    @Param('id') id: string,
    @Body() updateTargetDto: UpdateTargetRequestDto,
  ): Promise<TargetEntity> {
    return this.targetService.update(id, updateTargetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all targets' })
  @ApiResponse({
    status: 200,
    description: 'The targets have been successfully retrieved.',
    type: GetPaginatedTargetResponseDto,
  })
  async findAll(
    @Query() filter: FilterTargetRequestDto,
  ): Promise<GetPaginatedTargetResponseDto> {
    return this.targetService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a target by id' })
  @ApiResponse({
    status: 200,
    description: 'The target has been successfully retrieved.',
    type: GetOneTargetResponseDto,
  })
  async findById(@Param('id') id: string): Promise<GetOneTargetResponseDto> {
    return this.targetService.findById(id);
  }
}
