import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SourceSettingModule } from '../source-setting/source-setting.module';
import { SourceEntity } from './entities/source.entity';
import { SourceController } from './source.controller';
import { SourceRepository } from './source.repository';
import { SourceService } from './source.service';

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity]), SourceSettingModule],
  controllers: [SourceController],
  providers: [SourceService, SourceRepository],
  exports: [SourceRepository, SourceService],
})
export class SourceModule {}
