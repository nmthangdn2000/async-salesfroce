import {
  ICreateProfileRequestDto,
  TGetProfileResponseDto,
} from '@app/shared/dtos/profile/profile.dto';
import {
  TBaseFilterRequestDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import { TRelationalGetRoleResponseDto } from '@app/shared/dtos/role/role.dto';
import { TUser, USER_STATUS } from '@app/shared/models/user.model';

export type TGetUserProfileResponseDto = Omit<
  TUser,
  'password' | 'createdAt' | 'updatedAt' | 'roles' | 'profile' | 'permissions'
> & {
  profile: TGetProfileResponseDto;
  roles: TRelationalGetRoleResponseDto[];
  permissions: number[];
};

export type TFilterUserRequestDto = TBaseFilterRequestDto & {
  search?: string;
  dob?: Date;
  gender?: string;
  status?: USER_STATUS;
};

export type ICreateUserRequestDto = Pick<TUser, 'email' | 'password'> & {
  profile: ICreateProfileRequestDto;
  roles: string[];
  permissions: number[];
};

export type IUpdateUserRequestDto = Partial<ICreateUserRequestDto>;

export type TGetPaginatedUserProfileResponseDto =
  TBaseResponsePaginationDto<TGetUserProfileResponseDto>;
