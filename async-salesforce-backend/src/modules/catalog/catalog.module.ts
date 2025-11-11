import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CatalogController } from './catalog.controller';
import { CatalogRepository } from './catalog.repository';
import { CatalogService } from './catalog.service';
import { SfFieldsCatalogEntity } from './entities/sf-fields-catalog.entity';
import { SfObjectsCatalogEntity } from './entities/sf-objects-catalog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SfObjectsCatalogEntity, SfFieldsCatalogEntity]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService, CatalogRepository],
  exports: [CatalogRepository, CatalogService],
})
export class CatalogModule {}
