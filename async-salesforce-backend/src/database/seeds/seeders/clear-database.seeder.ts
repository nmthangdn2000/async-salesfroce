import { SfFieldsCatalogEntity } from 'src/modules/catalog/entities/sf-fields-catalog.entity';
import { SfObjectsCatalogEntity } from 'src/modules/catalog/entities/sf-objects-catalog.entity';
import { TypeDictionaryEntity } from 'src/modules/dictionary/entities/type-dictionary.entity';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { FieldMappingEntity } from 'src/modules/mapping/entities/field-mapping.entity';
import { ObjectMappingEntity } from 'src/modules/mapping/entities/object-mapping.entity';
import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { ProjectMemberEntity } from 'src/modules/project-member/entities/project-member.entity';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { SourceEntity } from 'src/modules/source/entities/source.entity';
import { SourceSettingEntity } from 'src/modules/source-setting/entities/source-setting.entity';
import { SyncJobEntity } from 'src/modules/sync/entities/sync-job.entity';
import { SyncRunEntity } from 'src/modules/sync/entities/sync-run.entity';
import { TargetEntity } from 'src/modules/target/entities/target.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DataSource } from 'typeorm';

export async function clearDatabase(dataSource: DataSource): Promise<void> {
  console.log('🗑️  Clearing existing data...');
  const entities = [
    SyncRunEntity,
    SyncJobEntity,
    FieldMappingEntity,
    ObjectMappingEntity,
    SfFieldsCatalogEntity,
    SfObjectsCatalogEntity,
    TypeDictionaryEntity,
    TargetEntity,
    SourceSettingEntity,
    SourceEntity,
    ProjectMemberEntity,
    ProjectEntity,
    FileEntity,
    UserEntity,
    RoleEntity,
    PermissionEntity,
  ];

  for (const entity of entities) {
    try {
      const repository = dataSource.getRepository(entity);
      await repository.clear();
    } catch (error) {
      // Ignore errors if table doesn't exist
      console.log(`⚠️  Skipping ${entity.name} (table may not exist)`);
    }
  }
  console.log('✅ Database cleared');
}
