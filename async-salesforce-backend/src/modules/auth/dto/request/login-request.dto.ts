import { TLoginRequestDto } from '@app/shared/dtos/auth/login.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsEmail } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class LoginRequestDto implements TLoginRequestDto {
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
}
