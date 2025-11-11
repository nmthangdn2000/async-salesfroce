import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import {
  TGetFileDetailResponseDto,
  TGetFileRelationResponseDto,
} from '@app/shared/dtos/file/file.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetFileDetailResponseDto
  extends BaseModelResponseDto
  implements TGetFileDetailResponseDto
{
  @ApiProperty({
    description: 'File ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  userId!: string;

  @ApiProperty({
    description: 'File name',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'File path',
  })
  @Expose()
  path!: string;

  @ApiProperty({
    description: 'File size',
  })
  @Expose()
  size!: number;

  @ApiProperty({
    description: 'File type',
  })
  @Expose()
  type!: string;

  @ApiProperty({
    description: 'File URL',
  })
  @Expose()
  url!: string;
}

export class GetFileRelationResponseDto
  extends BaseModelResponseDto
  implements TGetFileRelationResponseDto
{
  @ApiProperty({
    description: 'File name',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'File URL',
  })
  @Expose()
  url!: string;

  @ApiProperty({
    description: 'File type',
  })
  @Expose()
  type!: string;
}
