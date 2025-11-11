import {
  SOURCE_ENVIRONMENT,
  SOURCE_PROVIDER,
  SOURCE_STATUS,
} from '@app/shared/models/source.model';
import { randomUUID } from 'crypto';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { SourceEntity } from 'src/modules/source/entities/source.entity';
import { DataSource } from 'typeorm';

export async function seedSources(
  dataSource: DataSource,
  projects: ProjectEntity[],
): Promise<SourceEntity[]> {
  console.log('🔌 Seeding sources...');
  const repository = dataSource.getRepository(SourceEntity);

  const sources = [
    {
      id: randomUUID(),
      projectId: projects[0].id,
      provider: SOURCE_PROVIDER.SALESFORCE,
      name: 'Salesforce Production',
      environment: SOURCE_ENVIRONMENT.PROD,
      status: SOURCE_STATUS.ACTIVE,
    },
    {
      id: randomUUID(),
      projectId: projects[0].id,
      provider: SOURCE_PROVIDER.SALESFORCE,
      name: 'Salesforce Sandbox',
      environment: SOURCE_ENVIRONMENT.SANDBOX,
      status: SOURCE_STATUS.ACTIVE,
    },
    {
      id: randomUUID(),
      projectId: projects[1].id,
      provider: SOURCE_PROVIDER.SALESFORCE,
      name: 'Salesforce Main',
      environment: SOURCE_ENVIRONMENT.PROD,
      status: SOURCE_STATUS.ACTIVE,
    },
    {
      id: randomUUID(),
      projectId: projects[2].id,
      provider: SOURCE_PROVIDER.HUBSPOT,
      name: 'HubSpot CRM',
      environment: SOURCE_ENVIRONMENT.PROD,
      status: SOURCE_STATUS.ACTIVE,
    },
  ];

  const savedSources = await repository.save(sources);
  return savedSources;
}
