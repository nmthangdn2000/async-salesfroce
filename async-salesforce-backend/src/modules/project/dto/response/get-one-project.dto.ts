import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetOneProjectResponseDto {
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id!: string;

  @ApiResponseProperty({
    type: String,
    example: 'My Project',
  })
  @Expose()
  name!: string;

  @ApiResponseProperty({
    type: String,
    example: 'my-project',
  })
  @Expose()
  slug!: string;

  @ApiResponseProperty({
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt!: Date;

  @ApiResponseProperty({
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt!: Date;
}
