import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DictionaryController } from './dictionary.controller';
import { DictionaryRepository } from './dictionary.repository';
import { DictionaryService } from './dictionary.service';
import { TypeDictionaryEntity } from './entities/type-dictionary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeDictionaryEntity])],
  controllers: [DictionaryController],
  providers: [DictionaryService, DictionaryRepository],
  exports: [DictionaryRepository, DictionaryService],
})
export class DictionaryModule {}
