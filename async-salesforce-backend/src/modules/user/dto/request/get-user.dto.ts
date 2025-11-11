import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterUserRequestDto } from '@app/shared/dtos/user/user.dto';
import { USER_STATUS } from '@app/shared/models/user.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterUserRequestDto
  extends BaseFilterRequestDto
  implements TFilterUserRequestDto
{
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDate()
  dob?: Date;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    type: String,
    enum: USER_STATUS,
    required: false,
  })
  @IsOptional()
  @IsEnum(USER_STATUS)
  status?: USER_STATUS;
}
