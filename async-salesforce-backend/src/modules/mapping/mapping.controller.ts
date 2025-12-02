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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BulkCreateFieldMappingRequestDto } from './dto/requests/bulk-create-field-mapping.dto';
import { ImportFieldMappingsFromCatalogRequestDto } from './dto/requests/import-field-mappings-from-catalog.dto';
import { CreateFieldMappingRequestDto } from './dto/requests/create-field-mapping.dto';
import { CreateObjectMappingRequestDto } from './dto/requests/create-object-mapping.dto';
import { FilterFieldMappingRequestDto } from './dto/requests/filter-field-mapping.dto';
import { FilterObjectMappingRequestDto } from './dto/requests/filter-object-mapping.dto';
import { UpdateFieldMappingRequestDto } from './dto/requests/update-field-mapping.dto';
import { UpdateObjectMappingRequestDto } from './dto/requests/update-object-mapping.dto';
import { GetPaginatedFieldMappingResponseDto } from './dto/response/get-all-field-mapping.dto';
import { GetPaginatedObjectMappingResponseDto } from './dto/response/get-all-object-mapping.dto';
import { GetOneFieldMappingResponseDto } from './dto/response/get-one-field-mapping.dto';
import { GetOneObjectMappingResponseDto } from './dto/response/get-one-object-mapping.dto';
import { FieldMappingEntity } from './entities/field-mapping.entity';
import { ObjectMappingEntity } from './entities/object-mapping.entity';
import { MappingService } from './mapping.service';

@ApiTags('Mappings')
@Controller('mappings')
export class MappingController {
  constructor(private readonly mappingService: MappingService) {}

  // Object Mapping endpoints
  @Post('objects')
  @ApiOperation({ summary: 'Create a new object mapping' })
  @ApiResponse({
    status: 201,
    description: 'The object mapping has been successfully created.',
    type: ObjectMappingEntity,
  })
  @ApiBody({ type: CreateObjectMappingRequestDto })
  async createObjectMapping(
    @Body() createDto: CreateObjectMappingRequestDto,
  ): Promise<ObjectMappingEntity> {
    return this.mappingService.createObjectMapping(createDto);
  }

  @Get('objects')
  @ApiOperation({ summary: 'Get all object mappings' })
  @ApiResponse({
    status: 200,
    description: 'The object mappings have been successfully retrieved.',
    type: GetPaginatedObjectMappingResponseDto,
  })
  async findAllObjectMappings(
    @Query() filter: FilterObjectMappingRequestDto,
  ): Promise<GetPaginatedObjectMappingResponseDto> {
    return this.mappingService.findAllObjectMappings(filter);
  }

  @Get('objects/:id')
  @ApiOperation({ summary: 'Get an object mapping by id' })
  @ApiParam({ name: 'id', description: 'Object mapping ID' })
  @ApiResponse({
    status: 200,
    description: 'The object mapping has been successfully retrieved.',
    type: GetOneObjectMappingResponseDto,
  })
  async findObjectMappingById(
    @Param('id') id: string,
  ): Promise<GetOneObjectMappingResponseDto> {
    return this.mappingService.findObjectMappingById(id);
  }

  @Patch('objects/:id')
  @ApiOperation({ summary: 'Update an object mapping' })
  @ApiParam({ name: 'id', description: 'Object mapping ID' })
  @ApiResponse({
    status: 200,
    description: 'The object mapping has been successfully updated.',
    type: ObjectMappingEntity,
  })
  @ApiBody({ type: UpdateObjectMappingRequestDto })
  async updateObjectMapping(
    @Param('id') id: string,
    @Body() updateDto: UpdateObjectMappingRequestDto,
  ): Promise<ObjectMappingEntity> {
    return this.mappingService.updateObjectMapping(id, updateDto);
  }

  @Delete('objects/:id')
  @ApiOperation({ summary: 'Delete an object mapping' })
  @ApiParam({ name: 'id', description: 'Object mapping ID' })
  @ApiResponse({
    status: 200,
    description: 'The object mapping has been successfully deleted.',
  })
  async deleteObjectMapping(@Param('id') id: string): Promise<void> {
    return this.mappingService.deleteObjectMapping(id);
  }

  // Field Mapping endpoints
  @Post('fields')
  @ApiOperation({ summary: 'Create a new field mapping' })
  @ApiResponse({
    status: 201,
    description: 'The field mapping has been successfully created.',
    type: FieldMappingEntity,
  })
  @ApiBody({ type: CreateFieldMappingRequestDto })
  async createFieldMapping(
    @Body() createDto: CreateFieldMappingRequestDto,
  ): Promise<FieldMappingEntity> {
    return this.mappingService.createFieldMapping(createDto);
  }

  @Post('fields/bulk')
  @ApiOperation({ summary: 'Bulk create field mappings' })
  @ApiResponse({
    status: 201,
    description: 'The field mappings have been successfully created.',
    type: [FieldMappingEntity],
  })
  @ApiBody({ type: BulkCreateFieldMappingRequestDto })
  async bulkCreateFieldMappings(
    @Body() bulkDto: BulkCreateFieldMappingRequestDto,
  ): Promise<FieldMappingEntity[]> {
    return this.mappingService.bulkCreateFieldMappings(bulkDto);
  }

  @Post('fields/import-from-catalog')
  @ApiOperation({
    summary: 'Import field mappings from catalog fields',
    description:
      'Automatically creates field mappings from selected catalog fields. Target column names and logical types are auto-generated.',
  })
  @ApiResponse({
    status: 201,
    description: 'The field mappings have been successfully imported.',
    type: [FieldMappingEntity],
  })
  @ApiBody({ type: ImportFieldMappingsFromCatalogRequestDto })
  async importFieldMappingsFromCatalog(
    @Body() importDto: ImportFieldMappingsFromCatalogRequestDto,
  ): Promise<FieldMappingEntity[]> {
    return this.mappingService.importFieldMappingsFromCatalog(importDto);
  }

  @Get('fields')
  @ApiOperation({ summary: 'Get all field mappings' })
  @ApiResponse({
    status: 200,
    description: 'The field mappings have been successfully retrieved.',
    type: GetPaginatedFieldMappingResponseDto,
  })
  async findAllFieldMappings(
    @Query() filter: FilterFieldMappingRequestDto,
  ): Promise<GetPaginatedFieldMappingResponseDto> {
    return this.mappingService.findAllFieldMappings(filter);
  }

  @Get('fields/:id')
  @ApiOperation({ summary: 'Get a field mapping by id' })
  @ApiParam({ name: 'id', description: 'Field mapping ID' })
  @ApiResponse({
    status: 200,
    description: 'The field mapping has been successfully retrieved.',
    type: GetOneFieldMappingResponseDto,
  })
  async findFieldMappingById(
    @Param('id') id: string,
  ): Promise<GetOneFieldMappingResponseDto> {
    return this.mappingService.findFieldMappingById(id);
  }

  @Patch('fields/:id')
  @ApiOperation({ summary: 'Update a field mapping' })
  @ApiParam({ name: 'id', description: 'Field mapping ID' })
  @ApiResponse({
    status: 200,
    description: 'The field mapping has been successfully updated.',
    type: FieldMappingEntity,
  })
  @ApiBody({ type: UpdateFieldMappingRequestDto })
  async updateFieldMapping(
    @Param('id') id: string,
    @Body() updateDto: UpdateFieldMappingRequestDto,
  ): Promise<FieldMappingEntity> {
    return this.mappingService.updateFieldMapping(id, updateDto);
  }

  @Delete('fields/:id')
  @ApiOperation({ summary: 'Delete a field mapping' })
  @ApiParam({ name: 'id', description: 'Field mapping ID' })
  @ApiResponse({
    status: 200,
    description: 'The field mapping has been successfully deleted.',
  })
  async deleteFieldMapping(@Param('id') id: string): Promise<void> {
    return this.mappingService.deleteFieldMapping(id);
  }
}
