import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AUTH_TYPE } from '@app/shared/models/source.model';

export class CreateSourceSettingRequestDto {
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
  @IsOptional()
  authType?: AUTH_TYPE;

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
    description: 'Secrets reference',
    example: 'secret-key-ref',
  })
  @IsString()
  @IsNotEmpty()
  secretsRef!: string;
}

