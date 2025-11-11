import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSourceSettingRequestDto } from 'src/modules/source-setting/dto/requests/create-source-setting.dto';
import { FilterSourceSettingRequestDto } from 'src/modules/source-setting/dto/requests/filter-source-setting.dto';
import { GetPaginatedSourceSettingResponseDto } from 'src/modules/source-setting/dto/response/get-all-source-setting.dto';
import { GetOneSourceSettingResponseDto } from 'src/modules/source-setting/dto/response/get-one-source-setting.dto';
import { SourceSettingEntity } from 'src/modules/source-setting/entities/source-setting.entity';

import { SourceSettingService } from './source-setting.service';

@ApiTags('Source Settings')
@Controller('source-settings')
export class SourceSettingController {
  constructor(private readonly sourceSettingService: SourceSettingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new source setting' })
  @ApiResponse({
    status: 201,
    description: 'The source setting has been successfully created.',
    type: GetOneSourceSettingResponseDto,
  })
  @ApiBody({ type: CreateSourceSettingRequestDto })
  async create(
    @Body() createSourceSettingDto: CreateSourceSettingRequestDto,
  ): Promise<SourceSettingEntity> {
    return this.sourceSettingService.create(createSourceSettingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all source settings' })
  @ApiResponse({
    status: 200,
    description: 'The source settings have been successfully retrieved.',
    type: GetPaginatedSourceSettingResponseDto,
  })
  async findAll(
    @Query() filter: FilterSourceSettingRequestDto,
  ): Promise<GetPaginatedSourceSettingResponseDto> {
    return this.sourceSettingService.findAll(filter);
  }

  @Get('source/:sourceId')
  @ApiOperation({ summary: 'Get a source setting by source id' })
  @ApiResponse({
    status: 200,
    description: 'The source setting has been successfully retrieved.',
    type: GetOneSourceSettingResponseDto,
  })
  async findBySourceId(
    @Param('sourceId') sourceId: string,
  ): Promise<GetOneSourceSettingResponseDto> {
    return this.sourceSettingService.findBySourceId(sourceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a source setting by id' })
  @ApiResponse({
    status: 200,
    description: 'The source setting has been successfully retrieved.',
    type: GetOneSourceSettingResponseDto,
  })
  async findById(
    @Param('id') id: string,
  ): Promise<GetOneSourceSettingResponseDto> {
    return this.sourceSettingService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a source setting' })
  @ApiResponse({
    status: 200,
    description: 'The source setting has been successfully updated.',
    type: GetOneSourceSettingResponseDto,
  })
  @ApiBody({ type: CreateSourceSettingRequestDto })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateSourceSettingRequestDto>,
  ): Promise<SourceSettingEntity> {
    return this.sourceSettingService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a source setting' })
  @ApiResponse({
    status: 200,
    description: 'The source setting has been successfully deleted.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.sourceSettingService.remove(id);
  }
}
