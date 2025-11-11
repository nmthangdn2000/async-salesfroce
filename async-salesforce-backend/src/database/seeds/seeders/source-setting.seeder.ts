import { AUTH_TYPE } from '@app/shared/models/source.model';
import { randomUUID } from 'crypto';
import { SourceEntity } from 'src/modules/source/entities/source.entity';
import { SourceSettingEntity } from 'src/modules/source-setting/entities/source-setting.entity';
import { DataSource } from 'typeorm';

export async function seedSourceSettings(
  dataSource: DataSource,
  sources: SourceEntity[],
): Promise<SourceSettingEntity[]> {
  console.log('⚙️  Seeding source settings...');
  const repository = dataSource.getRepository(SourceSettingEntity);

  const sourceSettings = sources.map((source) => ({
    id: randomUUID(),
    sourceId: source.id,
    instanceUrl: `https://${source.name.toLowerCase().replace(/\s+/g, '-')}.salesforce.com`,
    authType: AUTH_TYPE.OAUTH2,
    scopes: ['api', 'refresh_token', 'offline_access'],
    secretsRef: `secret-${source.id}`,
  }));

  const savedSettings = await repository.save(sourceSettings);
  return savedSettings;
}
