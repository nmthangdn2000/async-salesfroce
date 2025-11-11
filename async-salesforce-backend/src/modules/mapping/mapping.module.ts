import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FieldMappingEntity } from './entities/field-mapping.entity';
import { ObjectMappingEntity } from './entities/object-mapping.entity';
import { MappingController } from './mapping.controller';
import { MappingRepository } from './mapping.repository';
import { MappingService } from './mapping.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ObjectMappingEntity, FieldMappingEntity]),
  ],
  controllers: [MappingController],
  providers: [MappingService, MappingRepository],
  exports: [MappingRepository, MappingService],
})
export class MappingModule {}
