import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SyncJobEntity } from './entities/sync-job.entity';
import { SyncRunEntity } from './entities/sync-run.entity';
import { SyncController } from './sync.controller';
import { SyncRepository } from './sync.repository';
import { SyncRunRepository } from './sync-run.repository';
import { SyncService } from './sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([SyncJobEntity, SyncRunEntity])],
  controllers: [SyncController],
  providers: [SyncService, SyncRepository, SyncRunRepository],
  exports: [SyncRepository, SyncRunRepository, SyncService],
})
export class SyncModule {}
