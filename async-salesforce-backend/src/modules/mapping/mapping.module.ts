import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '../catalog/catalog.module';
import { DictionaryModule } from '../dictionary/dictionary.module';

import { FieldMappingEntity } from './entities/field-mapping.entity';
import { ObjectMappingEntity } from './entities/object-mapping.entity';
import { FieldMappingRepository } from './field-mapping.repository';
import { MappingController } from './mapping.controller';
import { MappingRepository } from './mapping.repository';
import { MappingService } from './mapping.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ObjectMappingEntity, FieldMappingEntity]),
    CatalogModule,
    DictionaryModule,
  ],
  controllers: [MappingController],
  providers: [MappingService, MappingRepository, FieldMappingRepository],
  exports: [MappingRepository, FieldMappingRepository, MappingService],
})
export class MappingModule {}
