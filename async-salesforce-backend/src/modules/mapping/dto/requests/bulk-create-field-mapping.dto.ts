import { IBulkCreateFieldMappingRequestDto } from '@app/shared/dtos/mapping/mapping.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class FieldMappingItemDto {
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

export class BulkCreateFieldMappingRequestDto
  implements IBulkCreateFieldMappingRequestDto
{
  @ApiProperty({
    description: 'Object Mapping ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  objectMappingId!: string;

  @ApiProperty({
    description: 'Array of field mappings',
    type: [FieldMappingItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldMappingItemDto)
  fieldMappings!: FieldMappingItemDto[];
}

