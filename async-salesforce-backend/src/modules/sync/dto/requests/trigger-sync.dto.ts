import { ITriggerSyncRequestDto } from '@app/shared/dtos/sync/sync.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class TriggerSyncRequestDto implements ITriggerSyncRequestDto {
  @ApiProperty({
    description: 'Sync Job ID to trigger',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  jobId!: string;
}

