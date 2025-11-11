import { CoreModule } from '@app/core';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';

import { CatalogModule } from './modules/catalog/catalog.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { FileModule } from './modules/file/file.module';
import { MappingModule } from './modules/mapping/mapping.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ProjectModule } from './modules/project/project.module';
import { RoleModule } from './modules/role/role.module';
import { SourceModule } from './modules/source/source.module';
import { SyncModule } from './modules/sync/sync.module';
import { TargetModule } from './modules/target/target.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule,
    FileModule,
    ProjectModule,
    SourceModule,
    TargetModule,
    CatalogModule,
    MappingModule,
    DictionaryModule,
    SyncModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
