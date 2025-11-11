import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import {
  TSfFieldsCatalog,
  TSfObjectsCatalog,
} from '@app/shared/models/catalog.model';

// SfFieldsCatalog DTOs (defined first to avoid forward reference)
export type TFilterSfFieldsCatalogRequestDto = TBaseFilterRequestDto & {
  objectId?: string;
  search?: string;
  isSelected?: boolean;
  sfType?: string;
};

export type TGetSfFieldsCatalogResponseDto = TBaseModelResponseDto &
  Omit<
    TSfFieldsCatalog,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'object'
  > & {
    objectId: string;
  };

export type TGetPaginatedSfFieldsCatalogResponseDto =
  TBaseResponsePaginationDto<TGetSfFieldsCatalogResponseDto>;

export type ICreateSfFieldsCatalogRequestDto = Pick<
  TSfFieldsCatalog,
  | 'objectId'
  | 'apiName'
  | 'label'
  | 'sfType'
  | 'isRequired'
  | 'length'
  | 'precision'
  | 'scale'
  | 'isSelected'
> & {
  selectedBy?: string;
};

export type IUpdateSfFieldsCatalogRequestDto =
  Partial<ICreateSfFieldsCatalogRequestDto> & {
    selectedBy?: string;
    selectedAt?: Date;
  };

// SfObjectsCatalog DTOs
export type TFilterSfObjectsCatalogRequestDto = TBaseFilterRequestDto & {
  sourceId?: string;
  search?: string;
  isSelected?: boolean;
};

export type TGetSfObjectsCatalogResponseDto = TBaseModelResponseDto &
  Omit<
    TSfObjectsCatalog,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'source'
    | 'sfFieldsCatalog'
  > & {
    sourceId: string;
    sfFieldsCatalog: TGetSfFieldsCatalogResponseDto[];
  };

export type TGetPaginatedSfObjectsCatalogResponseDto =
  TBaseResponsePaginationDto<TGetSfObjectsCatalogResponseDto>;

export type ICreateSfObjectsCatalogRequestDto = Pick<
  TSfObjectsCatalog,
  'sourceId' | 'apiName' | 'label' | 'isSelected'
> & {
  selectedBy?: string;
};

export type IUpdateSfObjectsCatalogRequestDto =
  Partial<ICreateSfObjectsCatalogRequestDto> & {
    selectedBy?: string;
    selectedAt?: Date;
  };
