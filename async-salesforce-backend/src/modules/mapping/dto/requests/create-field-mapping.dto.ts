import { ICreateFieldMappingRequestDto } from '@app/shared/dtos/mapping/mapping.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateFieldMappingRequestDto
  implements ICreateFieldMappingRequestDto
{
  @ApiProperty({
    description: 'Object Mapping ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  objectMappingId!: string;

  @ApiProperty({
    description: 'Salesforce Field API Name',
    example: 'Name',
  })
  @IsString()
  @IsNotEmpty()
  sfFieldApiName!: string;

  @ApiProperty({
    description: 'Target column name',
    example: 'name',
  })
  @IsString()
  @IsNotEmpty()
  targetColumn!: string;

  @ApiProperty({
    description: 'Logical type',
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  logicalType!: string;

  @ApiProperty({
    description: 'Target type override (optional)',
    example: 'VARCHAR(255)',
    required: false,
  })
  @IsOptional()
  @IsString()
  targetTypeOverride?: string;
}

