import { TLoginResponseDto } from '@app/shared/dtos/auth/login.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { GetUserProfileResponseDto } from 'src/modules/user/dto/response/get-user.dto';

export class LoginResponseDto implements TLoginResponseDto {
  @ApiResponseProperty({
    type: String,
    example: 'accessToken',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  accessToken!: string;

  @ApiResponseProperty({
    type: String,
    example: 'refreshToken',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  refreshToken!: string;

  @ApiResponseProperty({
    type: GetUserProfileResponseDto,
  })
  @Type(() => GetUserProfileResponseDto)
  @Expose()
  user!: GetUserProfileResponseDto;
}
