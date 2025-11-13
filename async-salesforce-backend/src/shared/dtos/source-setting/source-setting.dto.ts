import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import { AUTH_TYPE, TSourceSetting } from '@app/shared/models/source.model';

export type TFilterSourceSettingRequestDto = TBaseFilterRequestDto & {
  sourceId?: string;
  authType?: AUTH_TYPE;
};

export type TGetSourceSettingResponseDto = TBaseModelResponseDto &
  Omit<
    TSourceSetting,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'source'
    | 'secretsRef'
    | 'clientSecret'
  > & {
    sourceId: string;
  };

export type TGetPaginatedSourceSettingResponseDto =
  TBaseResponsePaginationDto<TGetSourceSettingResponseDto>;

export type ICreateSourceSettingRequestDto = Pick<
  TSourceSetting,
  'instanceUrl' | 'authType' | 'scopes' | 'clientId' | 'clientSecret' | 'refreshToken'
> & {
  sourceId: string;
};

export type IUpdateSourceSettingRequestDto = Partial<
  Omit<ICreateSourceSettingRequestDto, 'sourceId'>
>;
