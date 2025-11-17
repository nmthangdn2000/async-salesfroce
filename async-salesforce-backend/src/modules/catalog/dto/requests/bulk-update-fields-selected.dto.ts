import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsUUID } from 'class-validator';

export class BulkUpdateFieldsSelectedRequestDto {
  @ApiProperty({
    description: 'Array of field IDs to update',
    type: [String],
    example: ['uuid1', 'uuid2', 'uuid3'],
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  fieldIds!: string[];

  @ApiProperty({
    description: 'Selected status to set for all fields',
    example: true,
  })
  @IsBoolean()
  isSelected!: boolean;
}

