import { ICreateTargetRequestDto } from '@app/shared/dtos/target/target.dto';
import { TARGET_KIND } from '@app/shared/models/target.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTargetRequestDto implements ICreateTargetRequestDto {
  @ApiProperty({
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @ApiProperty({
    description: 'Source ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  sourceId!: string;

  @ApiProperty({
    description: 'Target kind (database type)',
    enum: TARGET_KIND,
    example: TARGET_KIND.POSTGRES,
  })
  @IsEnum(TARGET_KIND)
  @IsNotEmpty()
  kind!: TARGET_KIND;

  @ApiProperty({
    description: 'Target name',
    example: 'PostgreSQL Warehouse',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Connection type (host or url)',
    enum: ['host', 'url'],
    example: 'host',
    default: 'host',
  })
  @IsString()
  @IsOptional()
  connectionType?: string;

  @ApiProperty({
    description: 'Database host',
    required: false,
  })
  @IsOptional()
  @IsString()
  host?: string;

  @ApiProperty({
    description: 'Database port',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  port?: number;

  @ApiProperty({
    description: 'Database name',
    required: false,
  })
  @IsOptional()
  @IsString()
  database?: string;

  @ApiProperty({
    description: 'Database username',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Database schema',
    required: false,
  })
  @IsOptional()
  @IsString()
  schema?: string;

  @ApiProperty({
    description: 'Enable SSL',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  ssl?: boolean;

  @ApiProperty({
    description: 'SSL mode (for PostgreSQL)',
    required: false,
  })
  @IsOptional()
  @IsString()
  sslMode?: string;

  @ApiProperty({
    description: 'Full connection string',
    required: false,
  })
  @IsOptional()
  @IsString()
  connectionString?: string;
}

