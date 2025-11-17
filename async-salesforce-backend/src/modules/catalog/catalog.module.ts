import { SalesforceModule } from '@app/helper';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SourceSettingModule } from '../source-setting/source-setting.module';
import { CatalogController } from './catalog.controller';
import { SfObjectsCatalogRepository } from './catalog.repository';
import { CatalogService } from './catalog.service';
import { SfFieldsCatalogEntity } from './entities/sf-fields-catalog.entity';
import { SfObjectsCatalogEntity } from './entities/sf-objects-catalog.entity';
import { SfFieldsCatalogRepository } from './sf-fields-catalog.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([SfObjectsCatalogEntity, SfFieldsCatalogEntity]),
    SourceSettingModule,
    SalesforceModule,
  ],
  controllers: [CatalogController],
  providers: [
    CatalogService,
    SfObjectsCatalogRepository,
    SfFieldsCatalogRepository,
  ],
  exports: [
    SfObjectsCatalogRepository,
    SfFieldsCatalogRepository,
    CatalogService,
  ],
})
export class CatalogModule {}
