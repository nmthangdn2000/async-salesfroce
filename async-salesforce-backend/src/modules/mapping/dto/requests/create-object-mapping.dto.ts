import { ICreateObjectMappingRequestDto } from '@app/shared/dtos/mapping/mapping.dto';
import { PK_STRATEGY } from '@app/shared/models/mapping.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateObjectMappingRequestDto
  implements ICreateObjectMappingRequestDto
{
  @ApiProperty({
    description: 'Source ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  sourceId!: string;

  @ApiProperty({
    description: 'Salesforce Object API Name',
    example: 'Account',
  })
  @IsString()
  @IsNotEmpty()
  objectApiName!: string;

  @ApiProperty({
    description: 'Target ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  targetId!: string;

  @ApiProperty({
    description: 'Target table name',
    example: 'accounts',
  })
  @IsString()
  @IsNotEmpty()
  targetTable!: string;

  @ApiProperty({
    description: 'Primary key strategy',
    enum: PK_STRATEGY,
    example: PK_STRATEGY.SF_ID,
    required: false,
    default: PK_STRATEGY.SF_ID,
  })
  @IsEnum(PK_STRATEGY)
  @IsOptional()
  pkStrategy?: PK_STRATEGY;
}

