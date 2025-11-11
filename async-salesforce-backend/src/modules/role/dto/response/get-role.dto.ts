import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import {
  TGetPaginatedRoleResponseDto,
  TGetRoleResponseDto,
  TRelationalGetRoleResponseDto,
} from '@app/shared/dtos/role/role.dto';
import { TPermission, TRole } from '@app/shared/models';
import { ApiResponseProperty, PickType } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class GetRoleResponseDto
  extends BaseModelResponseDto
  implements TGetRoleResponseDto
{
  @ApiResponseProperty({
    type: String,
    example: 'admin',
  })
  @Expose()
  name!: string;

  @ApiResponseProperty({
    type: String,
    example: 'admin',
  })
  @Expose()
  description!: string;

  @ApiResponseProperty({
    type: [Number],
    example: [1, 2, 3],
  })
  @Type(() => Number)
  @Expose()
  @Transform(({ obj, value }: { obj: TRole; value: TPermission[] }) => {
    if (obj.permissions.length > 0 && obj.permissions[0]?.code) {
      return obj.permissions.map((permission) => permission.code);
    }

    return value;
  })
  permissions!: number[];

  @ApiResponseProperty({
    type: Number,
    example: 5,
  })
  @Expose()
  userCount!: number;
}

export class RelationalGetRoleResponseDto
  extends PickType(GetRoleResponseDto, ['name', 'description'])
  implements TRelationalGetRoleResponseDto {}

export class GetPaginatedRoleResponseDto
  extends BaseResponsePaginationDto<GetRoleResponseDto>
  implements TGetPaginatedRoleResponseDto {}
