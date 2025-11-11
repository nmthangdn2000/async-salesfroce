import { TRegisterRequestDto } from '@app/shared/dtos/auth/register.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class RegisterRequestDto implements TRegisterRequestDto {
  @ApiProperty({
    type: String,
    description: 'The email of the user',
    example: 'test@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    type: String,
    description: 'The password of the user',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    type: String,
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({
    type: String,
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;
}
