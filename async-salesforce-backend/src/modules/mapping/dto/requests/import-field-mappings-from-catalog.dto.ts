import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class ImportFieldMappingsFromCatalogRequestDto {
  @ApiProperty({
    description: 'Object Mapping ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  objectMappingId!: string;

  @ApiProperty({
    description: 'Array of catalog field IDs to import',
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
  })
  @IsArray()
  @IsNotEmpty()
  catalogFieldIds!: string[];
}

