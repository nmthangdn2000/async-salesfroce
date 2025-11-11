import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import { TTypeDictionary } from '@app/shared/models/dictionary.model';

export type TFilterDictionaryRequestDto = TBaseFilterRequestDto & {
  search?: string;
  sfType?: string;
  logicalType?: string;
};

export type TGetDictionaryResponseDto = TBaseModelResponseDto &
  Omit<
    TTypeDictionary,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
  >;

export type TGetPaginatedDictionaryResponseDto =
  TBaseResponsePaginationDto<TGetDictionaryResponseDto>;

export type ICreateDictionaryRequestDto = Pick<
  TTypeDictionary,
  | 'sfType'
  | 'logicalType'
  | 'pgType'
  | 'mysqlType'
  | 'sqlserverType'
  | 'bigqueryType'
  | 'snowflakeType'
  | 'clickhouseType'
>;

export type IUpdateDictionaryRequestDto = Partial<ICreateDictionaryRequestDto>;
