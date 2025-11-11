import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import {
  TGetPaginatedUserProfileResponseDto,
  TGetUserProfileResponseDto,
} from '@app/shared/dtos/user/user.dto';
import { TPermission } from '@app/shared/models';
import { TUser, USER_STATUS } from '@app/shared/models/user.model';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { RelationalGetRoleResponseDto } from 'src/modules/role/dto/response/get-role.dto';
import { ProfileResponseDto } from 'src/modules/user/dto/response/get-profile.dto';

export class GetUserProfileResponseDto
  extends BaseModelResponseDto
  implements TGetUserProfileResponseDto
{
  @ApiResponseProperty({
    type: String,
    example: 'test@gmail.com',
  })
  @Expose()
  email!: string;

  @ApiResponseProperty({
    type: ProfileResponseDto,
  })
  @Type(() => ProfileResponseDto)
  @Expose()
  profile!: ProfileResponseDto;

  @ApiResponseProperty({
    type: [RelationalGetRoleResponseDto],
  })
  @Type(() => RelationalGetRoleResponseDto)
  @Expose()
  roles!: RelationalGetRoleResponseDto[];

  @ApiResponseProperty({
    type: [Number],
    example: [10, 20, 30],
  })
  @Type(() => Number)
  @Expose()
  @Transform(({ obj, value }: { obj: TUser; value: TPermission[] }) => {
    if (obj.permissions?.length > 0 && obj.permissions[0]?.code) {
      return obj.permissions.map((permission) => permission.code);
    }

    return value;
  })
  permissions!: number[];

  @ApiResponseProperty({
    type: String,
    example: USER_STATUS.ACTIVE,
  })
  @Expose()
  status!: USER_STATUS;
}

export class GetPaginatedUserProfileResponseDto
  extends BaseResponsePaginationDto<GetUserProfileResponseDto>
  implements TGetPaginatedUserProfileResponseDto
{
  @ApiResponseProperty({
    type: [GetUserProfileResponseDto],
  })
  @Type(() => GetUserProfileResponseDto)
  @Expose()
  declare items: GetUserProfileResponseDto[];
}
