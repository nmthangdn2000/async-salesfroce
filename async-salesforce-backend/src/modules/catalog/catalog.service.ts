import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { SalesforceService } from '@app/helper/modules/salesforce';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { In } from 'typeorm';

import { SourceSettingService } from '../source-setting/source-setting.service';
import { SfObjectsCatalogRepository } from './catalog.repository';
import { FilterSfFieldsCatalogRequestDto } from './dto/requests/filter-sf-fields-catalog.dto';
import { FilterSfObjectsCatalogRequestDto } from './dto/requests/filter-sf-objects-catalog.dto';
import { GetPaginatedSfFieldsCatalogResponseDto } from './dto/response/get-all-sf-fields-catalog.dto';
import { GetPaginatedSfObjectsCatalogResponseDto } from './dto/response/get-all-sf-objects-catalog.dto';
import { GetOneSfFieldsCatalogResponseDto } from './dto/response/get-one-sf-fields-catalog.dto';
import { GetOneSfObjectsCatalogResponseDto } from './dto/response/get-one-sf-objects-catalog.dto';
import { SfFieldsCatalogEntity } from './entities/sf-fields-catalog.entity';
import { SfObjectsCatalogEntity } from './entities/sf-objects-catalog.entity';
import { SfFieldsCatalogRepository } from './sf-fields-catalog.repository';

@Injectable()
export class CatalogService {
  constructor(
    private readonly sfObjectsCatalogRepository: SfObjectsCatalogRepository,
    private readonly sfFieldsCatalogRepository: SfFieldsCatalogRepository,
    private readonly sourceSettingService: SourceSettingService,
    private readonly salesforceService: SalesforceService,
  ) {}

  /**
   * Get all objects from catalog database
   */
  async findAll(
    filter: FilterSfObjectsCatalogRequestDto,
  ): Promise<GetPaginatedSfObjectsCatalogResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const query =
      this.sfObjectsCatalogRepository.createQueryBuilder('sfObjectsCatalog');

    if (filter.sourceId) {
      query.andWhere('sfObjectsCatalog.sourceId = :sourceId', {
        sourceId: filter.sourceId,
      });
    }

    if (filter.search) {
      query.andWhere(
        '(sfObjectsCatalog.apiName ILIKE :search OR sfObjectsCatalog.label ILIKE :search)',
        {
          search: `%${filter.search}%`,
        },
      );
    }

    if (filter.isSelected !== undefined) {
      query.andWhere('sfObjectsCatalog.isSelected = :isSelected', {
        isSelected: filter.isSelected,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.sfObjectsCatalogRepository.paginate(
      query,
      filter,
      GetOneSfObjectsCatalogResponseDto,
    );

    return plainToInstance(GetPaginatedSfObjectsCatalogResponseDto, result);
  }

  /**
   * Sync all objects from Salesforce and save to catalog
   * Updates existing, creates new, and removes objects that no longer exist in Salesforce
   */
  async syncObjectsFromSalesforce(sourceId: string): Promise<{
    totalObjects: number;
    syncedObjects: number;
    updatedObjects: number;
    createdObjects: number;
    removedObjects: number;
  }> {
    // Get valid access token from sourceSettingService
    const { accessToken, instanceUrl } =
      await this.sourceSettingService.getValidAccessToken(sourceId);

    // Create Salesforce connection
    const connectionId = `sync-${sourceId}`;
    this.salesforceService.createConnection(connectionId, {
      instanceUrl,
      accessToken,
    });

    try {
      // Get all objects from Salesforce
      const describeResult =
        await this.salesforceService.getGlobalDescribe(connectionId);

      const sobjects = describeResult.sobjects || [];
      let syncedCount = 0;
      let updatedCount = 0;
      let createdCount = 0;

      // Get all existing objects in database for this source
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const existingObjects = await this.sfObjectsCatalogRepository.find({
        where: { sourceId },
      });

      // Create a map of existing objects by apiName for quick lookup
      const existingObjectsMap = new Map<string, SfObjectsCatalogEntity>(
        existingObjects.map((obj) => [obj.apiName, obj]),
      );

      // Track which objects exist in Salesforce
      const salesforceObjectNames = new Set<string>();

      // Sync each object from Salesforce
      for (const sobject of sobjects) {
        try {
          salesforceObjectNames.add(sobject.name);

          // Check if object already exists
          const existingObject = existingObjectsMap.get(sobject.name);

          if (existingObject) {
            // Update existing object
            existingObject.label = sobject.label;
            await this.sfObjectsCatalogRepository.save(existingObject);
            updatedCount++;
          } else {
            // Create new object
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const newObject = this.sfObjectsCatalogRepository.create({
              sourceId,
              apiName: sobject.name,
              label: sobject.label,
              isSelected: false,
            });
            await this.sfObjectsCatalogRepository.save(newObject);
            createdCount++;
          }

          syncedCount++;
        } catch (error) {
          // Log error but continue with other objects
          console.error(
            `Error syncing object ${sobject.name}:`,
            error instanceof Error ? error.message : error,
          );
        }
      }

      // Remove objects that no longer exist in Salesforce
      let removedCount = 0;
      for (const existingObject of existingObjects) {
        if (!salesforceObjectNames.has(existingObject.apiName)) {
          await this.sfObjectsCatalogRepository.remove(existingObject);
          removedCount++;
        }
      }

      // Clean up connection
      this.salesforceService.removeConnection(connectionId);

      return {
        totalObjects: sobjects.length,
        syncedObjects: syncedCount,
        updatedObjects: updatedCount,
        createdObjects: createdCount,
        removedObjects: removedCount,
      };
    } catch (error: unknown) {
      this.salesforceService.removeConnection(connectionId);
      if (error instanceof CustomHttpException) {
        throw error;
      }
      throw new CustomHttpException(ERROR_MESSAGES.OAuthCallbackFailed, 500);
    }
  }

  /**
   * Get all fields from catalog database
   */
  async findAllFields(
    filter: FilterSfFieldsCatalogRequestDto,
  ): Promise<GetPaginatedSfFieldsCatalogResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const query =
      this.sfFieldsCatalogRepository.createQueryBuilder('sfFieldsCatalog');

    if (filter.objectId) {
      query.andWhere('sfFieldsCatalog.objectId = :objectId', {
        objectId: filter.objectId,
      });
    }

    if (filter.search) {
      query.andWhere(
        '(sfFieldsCatalog.apiName ILIKE :search OR sfFieldsCatalog.label ILIKE :search)',
        {
          search: `%${filter.search}%`,
        },
      );
    }

    if (filter.isSelected !== undefined) {
      query.andWhere('sfFieldsCatalog.isSelected = :isSelected', {
        isSelected: filter.isSelected,
      });
    }

    if (filter.sfType) {
      query.andWhere('sfFieldsCatalog.sfType = :sfType', {
        sfType: filter.sfType,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.sfFieldsCatalogRepository.paginate(
      query,
      filter,
      GetOneSfFieldsCatalogResponseDto,
    );

    return plainToInstance(GetPaginatedSfFieldsCatalogResponseDto, result);
  }

  /**
   * Sync all fields from Salesforce for a specific object and save to catalog
   * Updates existing, creates new, and removes fields that no longer exist in Salesforce
   */
  async syncFieldsFromSalesforce(objectId: string): Promise<{
    totalFields: number;
    syncedFields: number;
    updatedFields: number;
    createdFields: number;
    removedFields: number;
  }> {
    // Get the object to find sourceId and apiName
    const object = await this.sfObjectsCatalogRepository.findOne({
      where: { id: objectId },
    });

    if (!object) {
      throw new HttpException('Object not found', HttpStatus.NOT_FOUND);
    }

    // Get valid access token from sourceSettingService
    const { accessToken, instanceUrl } =
      await this.sourceSettingService.getValidAccessToken(object.sourceId);

    // Create Salesforce connection
    const connectionId = `sync-fields-${object.sourceId}`;
    this.salesforceService.createConnection(connectionId, {
      instanceUrl,
      accessToken,
    });

    try {
      // Get object description from Salesforce (includes all fields)
      const describeResult = await this.salesforceService.describe(
        connectionId,
        object.apiName,
      );

      const fields = describeResult.fields || [];
      let syncedCount = 0;
      let updatedCount = 0;
      let createdCount = 0;

      // Get all existing fields in database for this object
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const existingFields = await this.sfFieldsCatalogRepository.find({
        where: { objectId },
      });

      // Create a map of existing fields by apiName for quick lookup
      const existingFieldsMap = new Map<string, SfFieldsCatalogEntity>(
        existingFields.map((field) => [field.apiName, field]),
      );

      // Track which fields exist in Salesforce
      const salesforceFieldNames = new Set<string>();

      // Sync each field from Salesforce
      for (const field of fields) {
        try {
          salesforceFieldNames.add(field.name);

          // Check if field already exists
          const existingField = existingFieldsMap.get(field.name);

          const isRequired = field.nillable === false;
          if (existingField) {
            // Update existing field
            existingField.label = field.label;
            existingField.sfType = field.type;
            existingField.isRequired = isRequired;
            existingField.length = field.length || undefined;
            existingField.precision = field.precision || undefined;
            existingField.scale = field.scale || undefined;
            // Auto-select required fields
            if (isRequired) {
              existingField.isSelected = true;
            }
            await this.sfFieldsCatalogRepository.save(existingField);
            updatedCount++;
          } else {
            // Create new field
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const newField = this.sfFieldsCatalogRepository.create({
              objectId,
              apiName: field.name,
              label: field.label,
              sfType: field.type,
              isRequired,
              length: field.length || undefined,
              precision: field.precision || undefined,
              scale: field.scale || undefined,
              // Auto-select required fields
              isSelected: isRequired,
            });
            await this.sfFieldsCatalogRepository.save(newField);
            createdCount++;
          }

          syncedCount++;
        } catch (error) {
          // Log error but continue with other fields
          console.error(
            `Error syncing field ${field.name}:`,
            error instanceof Error ? error.message : error,
          );
        }
      }

      // Remove fields that no longer exist in Salesforce
      let removedCount = 0;
      for (const existingField of existingFields) {
        if (!salesforceFieldNames.has(existingField.apiName)) {
          await this.sfFieldsCatalogRepository.remove(existingField);
          removedCount++;
        }
      }

      // Clean up connection
      this.salesforceService.removeConnection(connectionId);

      return {
        totalFields: fields.length,
        syncedFields: syncedCount,
        updatedFields: updatedCount,
        createdFields: createdCount,
        removedFields: removedCount,
      };
    } catch (error: unknown) {
      this.salesforceService.removeConnection(connectionId);
      if (error instanceof CustomHttpException) {
        throw error;
      }
      throw new CustomHttpException(ERROR_MESSAGES.OAuthCallbackFailed, 500);
    }
  }

  /**
   * Toggle selected status for an object
   */
  async toggleObjectSelected(
    objectId: string,
    isSelected: boolean,
    userId?: string,
  ): Promise<SfObjectsCatalogEntity> {
    const object = await this.sfObjectsCatalogRepository.findOne({
      where: { id: objectId },
    });

    if (!object) {
      throw new HttpException('Object not found', HttpStatus.NOT_FOUND);
    }

    object.isSelected = isSelected;
    if (isSelected) {
      object.selectedBy = userId;
      object.selectedAt = new Date();
    } else {
      object.selectedBy = undefined;
      object.selectedAt = undefined;
    }

    return this.sfObjectsCatalogRepository.save(object);
  }

  /**
   * Toggle selected status for a field
   */
  async toggleFieldSelected(
    fieldId: string,
    isSelected: boolean,
    userId?: string,
  ): Promise<SfFieldsCatalogEntity> {
    const field = await this.sfFieldsCatalogRepository.findOne({
      where: { id: fieldId },
    });

    if (!field) {
      throw new HttpException('Field not found', HttpStatus.NOT_FOUND);
    }

    // Prevent unselecting required fields
    if (!isSelected && field.isRequired) {
      throw new HttpException(
        'Cannot unselect required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    field.isSelected = isSelected;
    if (isSelected) {
      field.selectedBy = userId;
      field.selectedAt = new Date();
    } else {
      field.selectedBy = undefined;
      field.selectedAt = undefined;
    }

    return this.sfFieldsCatalogRepository.save(field);
  }

  /**
   * Bulk update selected status for multiple fields
   * When deselecting, required fields are skipped
   */
  async bulkUpdateFieldsSelected(
    fieldIds: string[],
    isSelected: boolean,
    userId?: string,
  ): Promise<{ updatedCount: number; skippedCount: number }> {
    if (fieldIds.length === 0) {
      return { updatedCount: 0, skippedCount: 0 };
    }

    // Get all fields
    const fields = await this.sfFieldsCatalogRepository.find({
      where: { id: In(fieldIds) },
    });

    let updatedCount = 0;
    let skippedCount = 0;

    for (const field of fields) {
      // Skip required fields when deselecting
      if (!isSelected && field.isRequired) {
        skippedCount++;
        continue;
      }

      // Skip if already in desired state
      if (field.isSelected === isSelected) {
        continue;
      }

      field.isSelected = isSelected;
      if (isSelected) {
        field.selectedBy = userId;
        field.selectedAt = new Date();
      } else {
        field.selectedBy = undefined;
        field.selectedAt = undefined;
      }

      await this.sfFieldsCatalogRepository.save(field);
      updatedCount++;
    }

    return { updatedCount, skippedCount };
  }
}
