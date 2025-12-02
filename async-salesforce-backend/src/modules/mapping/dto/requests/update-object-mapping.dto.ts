import { IUpdateObjectMappingRequestDto } from '@app/shared/dtos/mapping/mapping.dto';
import { PK_STRATEGY } from '@app/shared/models/mapping.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateObjectMappingRequestDto
  implements IUpdateObjectMappingRequestDto
{
  @ApiProperty({
    description: 'Salesforce Object API Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  objectApiName?: string;

  @ApiProperty({
    description: 'Target table name',
    required: false,
  })
  @IsOptional()
  @IsString()
  targetTable?: string;

  @ApiProperty({
    description: 'Primary key strategy',
    enum: PK_STRATEGY,
    required: false,
  })
  @IsOptional()
  @IsEnum(PK_STRATEGY)
  pkStrategy?: PK_STRATEGY;
}

