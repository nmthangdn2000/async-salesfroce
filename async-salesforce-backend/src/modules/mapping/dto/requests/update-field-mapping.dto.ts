import { IUpdateFieldMappingRequestDto } from '@app/shared/dtos/mapping/mapping.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFieldMappingRequestDto
  implements IUpdateFieldMappingRequestDto
{
  @ApiProperty({
    description: 'Salesforce Field API Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  sfFieldApiName?: string;

  @ApiProperty({
    description: 'Target column name',
    required: false,
  })
  @IsOptional()
  @IsString()
  targetColumn?: string;

  @ApiProperty({
    description: 'Logical type',
    required: false,
  })
  @IsOptional()
  @IsString()
  logicalType?: string;

  @ApiProperty({
    description: 'Target type override',
    required: false,
  })
  @IsOptional()
  @IsString()
  targetTypeOverride?: string;
}

