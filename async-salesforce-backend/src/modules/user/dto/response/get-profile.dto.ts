import { TGetProfileResponseDto } from '@app/shared/dtos/profile/profile.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProfileResponseDto implements TGetProfileResponseDto {
  @ApiResponseProperty({
    type: String,
    example: '1234567890',
  })
  @Expose()
  userId!: string;

  @ApiResponseProperty({
    type: String,
    example: 'John',
  })
  @Expose()
  firstName!: string;

  @ApiResponseProperty({
    type: String,
    example: 'Doe',
  })
  @Expose()
  lastName!: string;

  @ApiResponseProperty({
    type: String,
    example: '0123456789',
  })
  @Expose()
  phone!: string;

  @ApiResponseProperty({
    type: String,
    example: 'https://example.com/avatar.jpg',
  })
  @Expose()
  avatar!: string;

  @ApiResponseProperty({
    type: String,
    example: 'male',
  })
  @Expose()
  gender!: string;

  @ApiResponseProperty({
    type: String,
    example: '2000-01-01',
  })
  @Expose()
  dob!: Date;

  @ApiResponseProperty({
    type: String,
    example: 'John Doe is a software engineer',
  })
  @Expose()
  bio!: string;

  @ApiResponseProperty({
    type: String,
    example: '1234567890',
  })
  @Expose()
  address!: string;
}
