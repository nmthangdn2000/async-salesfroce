import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { PK_STRATEGY } from '@app/shared/models/mapping.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';
import { CreateFieldMappingRequestDto } from './dto/requests/create-field-mapping.dto';
import { CreateObjectMappingRequestDto } from './dto/requests/create-object-mapping.dto';
import { FilterFieldMappingRequestDto } from './dto/requests/filter-field-mapping.dto';
import { FilterObjectMappingRequestDto } from './dto/requests/filter-object-mapping.dto';
import { UpdateFieldMappingRequestDto } from './dto/requests/update-field-mapping.dto';
import { UpdateObjectMappingRequestDto } from './dto/requests/update-object-mapping.dto';
import { BulkCreateFieldMappingRequestDto } from './dto/requests/bulk-create-field-mapping.dto';
import { GetPaginatedFieldMappingResponseDto } from './dto/response/get-all-field-mapping.dto';
import { GetPaginatedObjectMappingResponseDto } from './dto/response/get-all-object-mapping.dto';
import { GetOneFieldMappingResponseDto } from './dto/response/get-one-field-mapping.dto';
import { GetOneObjectMappingResponseDto } from './dto/response/get-one-object-mapping.dto';
import { SfFieldsCatalogRepository } from '../catalog/sf-fields-catalog.repository';
import { DictionaryRepository } from '../dictionary/dictionary.repository';
import { FieldMappingEntity } from './entities/field-mapping.entity';
import { ObjectMappingEntity } from './entities/object-mapping.entity';
import { FieldMappingRepository } from './field-mapping.repository';
import { MappingRepository } from './mapping.repository';
import { ImportFieldMappingsFromCatalogRequestDto } from './dto/requests/import-field-mappings-from-catalog.dto';

@Injectable()
export class MappingService {
  constructor(
    private readonly mappingRepository: MappingRepository,
    private readonly fieldMappingRepository: FieldMappingRepository,
    private readonly sfFieldsCatalogRepository: SfFieldsCatalogRepository,
    private readonly dictionaryRepository: DictionaryRepository,
    @InjectRepository(ObjectMappingEntity)
    private readonly objectMappingRepo: Repository<ObjectMappingEntity>,
    @InjectRepository(FieldMappingEntity)
    private readonly fieldMappingRepo: Repository<FieldMappingEntity>,
  ) {}

  // Object Mapping methods
  async createObjectMapping(
    createDto: CreateObjectMappingRequestDto,
  ): Promise<ObjectMappingEntity> {
    // Check if mapping already exists
    const existing = await this.objectMappingRepo.findOne({
      where: {
        sourceId: createDto.sourceId,
        objectApiName: createDto.objectApiName,
        targetId: createDto.targetId,
      },
    });

    if (existing) {
      throw new CustomHttpException(ERROR_MESSAGES.ObjectMappingAlreadyExists);
    }

    const mapping = this.objectMappingRepo.create({
      sourceId: createDto.sourceId,
      objectApiName: createDto.objectApiName,
      targetId: createDto.targetId,
      targetTable: createDto.targetTable,
      pkStrategy: createDto.pkStrategy || PK_STRATEGY.SF_ID,
    });

    return this.objectMappingRepo.save(mapping);
  }

  async updateObjectMapping(
    id: string,
    updateDto: UpdateObjectMappingRequestDto,
  ): Promise<ObjectMappingEntity> {
    const mapping = await this.objectMappingRepo.findOne({ where: { id } });

    if (!mapping) {
      throw new CustomHttpException(ERROR_MESSAGES.ObjectMappingNotFound);
    }

    Object.assign(mapping, updateDto);

    return this.objectMappingRepo.save(mapping);
  }

  async findObjectMappingById(
    id: string,
  ): Promise<GetOneObjectMappingResponseDto> {
    const mapping = await this.objectMappingRepo.findOne({
      where: { id },
      relations: ['fieldMappings'],
    });

    if (!mapping) {
      throw new CustomHttpException(ERROR_MESSAGES.ObjectMappingNotFound);
    }

    return plainToInstance(GetOneObjectMappingResponseDto, mapping);
  }

  async findAllObjectMappings(
    filter: FilterObjectMappingRequestDto,
  ): Promise<GetPaginatedObjectMappingResponseDto> {
    const query = this.objectMappingRepo.createQueryBuilder('mapping');

    if (filter.sourceId) {
      query.andWhere('mapping.sourceId = :sourceId', {
        sourceId: filter.sourceId,
      });
    }

    if (filter.targetId) {
      query.andWhere('mapping.targetId = :targetId', {
        targetId: filter.targetId,
      });
    }

    if (filter.search) {
      query.andWhere(
        '(mapping.objectApiName ILIKE :search OR mapping.targetTable ILIKE :search)',
        {
          search: `%${filter.search}%`,
        },
      );
    }

    const result = await this.mappingRepository.paginate(
      query,
      filter,
      GetOneObjectMappingResponseDto,
    );

    return plainToInstance(GetPaginatedObjectMappingResponseDto, result);
  }

  async deleteObjectMapping(id: string): Promise<void> {
    const mapping = await this.objectMappingRepo.findOne({ where: { id } });

    if (!mapping) {
      throw new CustomHttpException(ERROR_MESSAGES.ObjectMappingNotFound);
    }

    await this.objectMappingRepo.remove(mapping);
  }

  // Field Mapping methods
  async createFieldMapping(
    createDto: CreateFieldMappingRequestDto,
  ): Promise<FieldMappingEntity> {
    // Check if object mapping exists
    const objectMapping = await this.objectMappingRepo.findOne({
      where: { id: createDto.objectMappingId },
    });

    if (!objectMapping) {
      throw new CustomHttpException(ERROR_MESSAGES.ObjectMappingNotFound);
    }

    // Check if field mapping already exists
    const existing = await this.fieldMappingRepo.findOne({
      where: {
        objectMappingId: createDto.objectMappingId,
        sfFieldApiName: createDto.sfFieldApiName,
      },
    });

    if (existing) {
      throw new CustomHttpException(ERROR_MESSAGES.FieldMappingAlreadyExists);
    }

    const fieldMapping = this.fieldMappingRepo.create({
      objectMappingId: createDto.objectMappingId,
      sfFieldApiName: createDto.sfFieldApiName,
      targetColumn: createDto.targetColumn,
      logicalType: createDto.logicalType,
      targetTypeOverride: createDto.targetTypeOverride,
    });

    return this.fieldMappingRepo.save(fieldMapping);
  }

  async bulkCreateFieldMappings(
    bulkDto: BulkCreateFieldMappingRequestDto,
  ): Promise<FieldMappingEntity[]> {
    // Check if object mapping exists
    const objectMapping = await this.objectMappingRepo.findOne({
      where: { id: bulkDto.objectMappingId },
    });

    if (!objectMapping) {
      throw new CustomHttpException(ERROR_MESSAGES.ObjectMappingNotFound);
    }

    // Check for duplicates in the request
    const fieldNames = bulkDto.fieldMappings.map((f) => f.sfFieldApiName);
    const uniqueFieldNames = new Set(fieldNames);
    if (fieldNames.length !== uniqueFieldNames.size) {
      throw new CustomHttpException(ERROR_MESSAGES.FieldMappingAlreadyExists);
    }

    // Check for existing field mappings
    const existing = await this.fieldMappingRepo.find({
      where: {
        objectMappingId: bulkDto.objectMappingId,
        sfFieldApiName: In(fieldNames),
      },
    });

    if (existing.length > 0) {
      throw new CustomHttpException(ERROR_MESSAGES.FieldMappingAlreadyExists);
    }

    const fieldMappings = bulkDto.fieldMappings.map((fm) =>
      this.fieldMappingRepo.create({
        objectMappingId: bulkDto.objectMappingId,
        sfFieldApiName: fm.sfFieldApiName,
        targetColumn: fm.targetColumn,
        logicalType: fm.logicalType,
        targetTypeOverride: fm.targetTypeOverride,
      }),
    );

    return this.fieldMappingRepo.save(fieldMappings);
  }

  async updateFieldMapping(
    id: string,
    updateDto: UpdateFieldMappingRequestDto,
  ): Promise<FieldMappingEntity> {
    const fieldMapping = await this.fieldMappingRepo.findOne({
      where: { id },
    });

    if (!fieldMapping) {
      throw new CustomHttpException(ERROR_MESSAGES.FieldMappingNotFound);
    }

    Object.assign(fieldMapping, updateDto);

    return this.fieldMappingRepo.save(fieldMapping);
  }

  async findFieldMappingById(
    id: string,
  ): Promise<GetOneFieldMappingResponseDto> {
    const fieldMapping = await this.fieldMappingRepo.findOne({
      where: { id },
    });

    if (!fieldMapping) {
      throw new CustomHttpException(ERROR_MESSAGES.FieldMappingNotFound);
    }

    return plainToInstance(GetOneFieldMappingResponseDto, fieldMapping);
  }

  async findAllFieldMappings(
    filter: FilterFieldMappingRequestDto,
  ): Promise<GetPaginatedFieldMappingResponseDto> {
    const query = this.fieldMappingRepo.createQueryBuilder('fieldMapping');

    if (filter.objectMappingId) {
      query.andWhere('fieldMapping.objectMappingId = :objectMappingId', {
        objectMappingId: filter.objectMappingId,
      });
    }

    if (filter.search) {
      query.andWhere(
        '(fieldMapping.sfFieldApiName ILIKE :search OR fieldMapping.targetColumn ILIKE :search)',
        {
          search: `%${filter.search}%`,
        },
      );
    }

    const result = await this.fieldMappingRepository.paginate(
      query,
      filter,
      GetOneFieldMappingResponseDto,
    );

    return plainToInstance(GetPaginatedFieldMappingResponseDto, result);
  }

  async deleteFieldMapping(id: string): Promise<void> {
    const fieldMapping = await this.fieldMappingRepo.findOne({
      where: { id },
    });

    if (!fieldMapping) {
      throw new CustomHttpException(ERROR_MESSAGES.FieldMappingNotFound);
    }

    await this.fieldMappingRepo.remove(fieldMapping);
  }

  /**
   * Import field mappings from catalog fields
   * Automatically generates field mappings from selected catalog fields
   */
  async importFieldMappingsFromCatalog(
    importDto: ImportFieldMappingsFromCatalogRequestDto,
  ): Promise<FieldMappingEntity[]> {
    // Check if object mapping exists
    const objectMapping = await this.objectMappingRepo.findOne({
      where: { id: importDto.objectMappingId },
    });

    if (!objectMapping) {
      throw new CustomHttpException(ERROR_MESSAGES.ObjectMappingNotFound);
    }

    // Fetch catalog fields
    const catalogFields = await this.sfFieldsCatalogRepository.find({
      where: {
        id: In(importDto.catalogFieldIds),
      },
    });

    if (catalogFields.length === 0) {
      throw new CustomHttpException(ERROR_MESSAGES.NoCatalogFieldsFound);
    }

    // Check for existing field mappings
    const existingFieldMappings = await this.fieldMappingRepo.find({
      where: {
        objectMappingId: importDto.objectMappingId,
        sfFieldApiName: In(catalogFields.map((f) => f.apiName)),
      },
    });

    const existingFieldNames = new Set(
      existingFieldMappings.map((fm) => fm.sfFieldApiName),
    );

    // Filter out already mapped fields
    const fieldsToImport = catalogFields.filter(
      (field) => !existingFieldNames.has(field.apiName),
    );

    if (fieldsToImport.length === 0) {
      throw new CustomHttpException(ERROR_MESSAGES.AllFieldsAlreadyMapped);
    }

    // Get type dictionary for logical type mapping
    const typeDictionary = await this.dictionaryRepository.find({
      where: {
        sfType: In(fieldsToImport.map((f) => f.sfType)),
      },
    });

    const typeDictMap = new Map(
      typeDictionary.map((td) => [td.sfType, td.logicalType]),
    );

    // Create field mappings
    const fieldMappings = fieldsToImport.map((field) => {
      // Convert PascalCase to snake_case for target column
      const targetColumn = field.apiName
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '');

      // Get logical type from dictionary, default to 'string'
      const logicalType =
        typeDictMap.get(field.sfType) || this.getDefaultLogicalType(field.sfType);

      return this.fieldMappingRepo.create({
        objectMappingId: importDto.objectMappingId,
        sfFieldApiName: field.apiName,
        targetColumn,
        logicalType,
      });
    });

    return this.fieldMappingRepo.save(fieldMappings);
  }

  /**
   * Get default logical type based on Salesforce field type
   */
  private getDefaultLogicalType(sfType: string): string {
    const typeMap: Record<string, string> = {
      String: 'string',
      Text: 'string',
      TextArea: 'string',
      Email: 'string',
      Phone: 'string',
      Url: 'string',
      Picklist: 'string',
      MultiPicklist: 'string',
      Currency: 'number',
      Double: 'number',
      Int: 'number',
      Percent: 'number',
      Date: 'date',
      DateTime: 'datetime',
      Time: 'time',
      Boolean: 'boolean',
      Checkbox: 'boolean',
      Id: 'string',
      Reference: 'string',
      Lookup: 'string',
    };

    return typeMap[sfType] || 'string';
  }
}
