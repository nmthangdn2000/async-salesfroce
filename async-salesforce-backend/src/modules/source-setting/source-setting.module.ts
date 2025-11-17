import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SourceSettingEntity } from './entities/source-setting.entity';
import { SourceSettingController } from './source-setting.controller';
import { SourceSettingRepository } from './source-setting.repository';
import { SourceSettingService } from './source-setting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SourceSettingEntity]),
    HttpModule,
  ],
  controllers: [SourceSettingController],
  providers: [SourceSettingService, SourceSettingRepository],
  exports: [SourceSettingRepository, SourceSettingService],
})
export class SourceSettingModule {}
