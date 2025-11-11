import { ICreateUserRequestDto } from '@app/shared/dtos/user/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateProfileRequestDto } from 'src/modules/user/dto/request/create-profile.dto';

export class CreateUserRequestDto implements ICreateUserRequestDto {
  @ApiProperty({
    description: 'Email user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({
    description: 'Password user',
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiProperty({
    type: CreateProfileRequestDto,
  })
  @Type(() => CreateProfileRequestDto)
  @IsNotEmpty()
  @ValidateNested()
  profile!: CreateProfileRequestDto;

  @ApiProperty({
    description: 'Roles user',
    example: ['admin', 'user'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  roles!: string[];

  @ApiProperty({
    description: 'Permissions user',
    example: [1, 2, 3],
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  permissions!: number[];
}
