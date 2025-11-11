import { ICreateProfileRequestDto } from '@app/shared/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfileRequestDto implements ICreateProfileRequestDto {
  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: 'Họ của người dùng',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({
    description: 'Ngày sinh của người dùng',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDate()
  dob?: Date;

  @ApiProperty({
    description: 'Giới tính của người dùng',
    example: 'male',
  })
  @IsOptional()
  @IsString()
  gender?: string;
}
