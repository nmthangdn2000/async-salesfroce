import { ICreateSourceSettingRequestDto } from '@app/shared/dtos/source-setting/source-setting.dto';
import { AUTH_TYPE } from '@app/shared/models';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSourceSettingRequestDto
  implements ICreateSourceSettingRequestDto
{
  @ApiProperty({
    description: 'Source ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  sourceId!: string;

  @ApiProperty({
    description: 'Instance URL',
    example: 'https://myinstance.salesforce.com',
  })
  @IsString()
  @IsNotEmpty()
  instanceUrl!: string;

  @ApiProperty({
    description: 'Authentication type',
    enum: AUTH_TYPE,
    example: AUTH_TYPE.OAUTH2,
    required: false,
    default: AUTH_TYPE.OAUTH2,
  })
  @IsEnum(AUTH_TYPE)
  @IsNotEmpty()
  authType!: AUTH_TYPE;

  @ApiProperty({
    description: 'OAuth scopes',
    example: ['api', 'refresh_token'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  scopes?: string[];

  @ApiProperty({
    description: 'OAuth 2.0 Client ID',
    example: '3MVG9...',
    required: false,
  })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiProperty({
    description: 'OAuth 2.0 Client Secret',
    example: 'ABC123...',
    required: false,
  })
  @IsString()
  @IsOptional()
  clientSecret?: string;

  @ApiProperty({
    description:
      'OAuth 2.0 Refresh Token (manual entry if OAuth flow setup fails)',
    example: '5Aep861...',
    required: false,
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
