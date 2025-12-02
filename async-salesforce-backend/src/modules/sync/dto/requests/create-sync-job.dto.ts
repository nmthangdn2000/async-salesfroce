import { ICreateSyncJobRequestDto } from '@app/shared/dtos/sync/sync.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSyncJobRequestDto implements ICreateSyncJobRequestDto {
  @ApiProperty({
    description: 'Source ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  sourceId!: string;

  @ApiProperty({
    description: 'Target ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  targetId!: string;

  @ApiProperty({
    description: 'Sync type (e.g., "full", "incremental")',
    example: 'full',
  })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({
    description: 'Cron schedule expression (optional)',
    example: '0 0 * * *',
    required: false,
  })
  @IsString()
  @IsOptional()
  scheduleCron?: string;
}

