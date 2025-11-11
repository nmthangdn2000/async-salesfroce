import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import {
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import { TRole } from '@app/shared/models/role.model';

export type TFilterRoleRequestDto = BaseFilterRequestDto & {
  search?: string;
};

export type TGetRoleResponseDto = TBaseModelResponseDto &
  Omit<TRole, 'id' | 'createdAt' | 'updatedAt' | 'permissions' | 'users'> & {
    permissions: number[];
    userCount: number;
  };

export type TRelationalGetRoleResponseDto = Pick<TRole, 'name' | 'description'>;

export type TGetPaginatedRoleResponseDto =
  TBaseResponsePaginationDto<TGetRoleResponseDto>;

export type ICreateRoleRequestDto = Pick<TRole, 'name' | 'description'> & {
  permissions: number[];
};

export type IUpdateRoleRequestDto = Partial<ICreateRoleRequestDto>;
