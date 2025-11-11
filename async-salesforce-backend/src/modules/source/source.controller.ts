import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSourceRequestDto } from 'src/modules/source/dto/requests/create-source.dto';
import { FilterSourceRequestDto } from 'src/modules/source/dto/requests/filter-source.dto';
import { GetPaginatedSourceResponseDto } from 'src/modules/source/dto/response/get-all-source.dto';
import { GetOneSourceResponseDto } from 'src/modules/source/dto/response/get-one-source.dto';
import { SourceEntity } from 'src/modules/source/entities/source.entity';

import { SourceService } from './source.service';

@ApiTags('Sources')
@Controller('sources')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new source' })
  @ApiResponse({
    status: 201,
    description: 'The source has been successfully created.',
    type: GetOneSourceResponseDto,
  })
  @ApiBody({ type: CreateSourceRequestDto })
  async create(
    @Body() createSourceDto: CreateSourceRequestDto,
  ): Promise<SourceEntity> {
    return this.sourceService.create(createSourceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sources' })
  @ApiResponse({
    status: 200,
    description: 'The sources have been successfully retrieved.',
    type: GetPaginatedSourceResponseDto,
  })
  async findAll(
    @Query() filter: FilterSourceRequestDto,
  ): Promise<GetPaginatedSourceResponseDto> {
    return this.sourceService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a source by id' })
  @ApiResponse({
    status: 200,
    description: 'The source has been successfully retrieved.',
    type: GetOneSourceResponseDto,
  })
  async findById(
    @Param('id') id: string,
  ): Promise<GetOneSourceResponseDto> {
    return this.sourceService.findById(id);
  }
}
