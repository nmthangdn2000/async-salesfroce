import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetPermissionResponseDto } from '@app/shared/dtos/permission/permission.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetPermissionResponseDto
  extends BaseModelResponseDto
  implements TGetPermissionResponseDto
{
  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  @Expose()
  code!: number;

  @ApiResponseProperty({
    type: String,
    example: 'admin',
  })
  @Expose()
  key!: string;

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
    type: String,
    example: 'admin',
  })
  @Expose()
  module!: string;
}
