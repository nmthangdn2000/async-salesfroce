import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterSfFieldsCatalogRequestDto } from './dto/requests/filter-sf-fields-catalog.dto';
import { FilterSfObjectsCatalogRequestDto } from './dto/requests/filter-sf-objects-catalog.dto';
import { GetPaginatedSfFieldsCatalogResponseDto } from './dto/response/get-all-sf-fields-catalog.dto';
import { GetPaginatedSfObjectsCatalogResponseDto } from './dto/response/get-all-sf-objects-catalog.dto';

import { CatalogService } from './catalog.service';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('objects')
  @ApiOperation({
    summary: 'Get all catalog objects from database',
    description: 'Retrieves catalog objects from the database with filtering and pagination',
  })
  @ApiQuery({
    name: 'sourceId',
    required: false,
    description: 'Filter by source ID',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by API name or label',
  })
  @ApiQuery({
    name: 'isSelected',
    required: false,
    description: 'Filter by selected status',
  })
  @ApiResponse({
    status: 200,
    description: 'Catalog objects retrieved successfully',
    type: GetPaginatedSfObjectsCatalogResponseDto,
  })
  async findAll(
    @Query() filter: FilterSfObjectsCatalogRequestDto,
  ): Promise<GetPaginatedSfObjectsCatalogResponseDto> {
    return this.catalogService.findAll(filter);
  }

  @Post('sync/:sourceId')
  @ApiOperation({
    summary: 'Sync all objects from Salesforce to catalog',
    description:
      'Fetches all objects from Salesforce and saves them to the catalog database. Updates existing, creates new, and removes objects that no longer exist.',
  })
  @ApiParam({
    name: 'sourceId',
    description: 'Source ID to sync objects for',
  })
  @ApiResponse({
    status: 200,
    description: 'Objects synced successfully',
    schema: {
      type: 'object',
      properties: {
        totalObjects: { type: 'number' },
        syncedObjects: { type: 'number' },
        updatedObjects: { type: 'number' },
        createdObjects: { type: 'number' },
        removedObjects: { type: 'number' },
      },
    },
  })
  async syncObjects(@Param('sourceId') sourceId: string) {
    return this.catalogService.syncObjectsFromSalesforce(sourceId);
  }

  @Get('fields')
  @ApiOperation({
    summary: 'Get all catalog fields from database',
    description: 'Retrieves catalog fields from the database with filtering and pagination',
  })
  @ApiQuery({
    name: 'objectId',
    required: false,
    description: 'Filter by object ID',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by API name or label',
  })
  @ApiQuery({
    name: 'isSelected',
    required: false,
    description: 'Filter by selected status',
  })
  @ApiQuery({
    name: 'sfType',
    required: false,
    description: 'Filter by Salesforce field type',
  })
  @ApiResponse({
    status: 200,
    description: 'Catalog fields retrieved successfully',
    type: GetPaginatedSfFieldsCatalogResponseDto,
  })
  async findAllFields(
    @Query() filter: FilterSfFieldsCatalogRequestDto,
  ): Promise<GetPaginatedSfFieldsCatalogResponseDto> {
    return this.catalogService.findAllFields(filter);
  }

  @Post('fields/sync/:objectId')
  @ApiOperation({
    summary: 'Sync all fields from Salesforce to catalog for a specific object',
    description:
      'Fetches all fields from Salesforce for a specific object and saves them to the catalog database. Updates existing, creates new, and removes fields that no longer exist.',
  })
  @ApiParam({
    name: 'objectId',
    description: 'Object ID to sync fields for',
  })
  @ApiResponse({
    status: 200,
    description: 'Fields synced successfully',
    schema: {
      type: 'object',
      properties: {
        totalFields: { type: 'number' },
        syncedFields: { type: 'number' },
        updatedFields: { type: 'number' },
        createdFields: { type: 'number' },
        removedFields: { type: 'number' },
      },
    },
  })
  async syncFields(@Param('objectId') objectId: string) {
    return this.catalogService.syncFieldsFromSalesforce(objectId);
  }

  @Patch('objects/:objectId/selected')
  @ApiOperation({
    summary: 'Toggle selected status for an object',
    description: 'Update the selected status of a catalog object',
  })
  @ApiParam({
    name: 'objectId',
    description: 'Object ID to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Object selected status updated successfully',
  })
  async toggleObjectSelected(
    @Param('objectId') objectId: string,
    @Body() body: { isSelected: boolean },
  ) {
    return this.catalogService.toggleObjectSelected(
      objectId,
      body.isSelected,
    );
  }

  @Patch('fields/:fieldId/selected')
  @ApiOperation({
    summary: 'Toggle selected status for a field',
    description: 'Update the selected status of a catalog field',
  })
  @ApiParam({
    name: 'fieldId',
    description: 'Field ID to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Field selected status updated successfully',
  })
  async toggleFieldSelected(
    @Param('fieldId') fieldId: string,
    @Body() body: { isSelected: boolean },
  ) {
    return this.catalogService.toggleFieldSelected(fieldId, body.isSelected);
  }
}
