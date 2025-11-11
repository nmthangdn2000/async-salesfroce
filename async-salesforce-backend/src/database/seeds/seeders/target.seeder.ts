import { TARGET_KIND } from '@app/shared/models/target.model';
import { randomUUID } from 'crypto';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { TargetEntity } from 'src/modules/target/entities/target.entity';
import { DataSource } from 'typeorm';

export async function seedTargets(
  dataSource: DataSource,
  projects: ProjectEntity[],
): Promise<TargetEntity[]> {
  console.log('🎯 Seeding targets...');
  const repository = dataSource.getRepository(TargetEntity);

  const targets = [
    {
      id: randomUUID(),
      projectId: projects[0].id,
      kind: TARGET_KIND.POSTGRES,
      name: 'PostgreSQL Warehouse',
    },
    {
      id: randomUUID(),
      projectId: projects[0].id,
      kind: TARGET_KIND.BIGQUERY,
      name: 'BigQuery Analytics',
    },
    {
      id: randomUUID(),
      projectId: projects[1].id,
      kind: TARGET_KIND.SNOWFLAKE,
      name: 'Snowflake Data Lake',
    },
    {
      id: randomUUID(),
      projectId: projects[2].id,
      kind: TARGET_KIND.MYSQL,
      name: 'MySQL Database',
    },
  ];

  const savedTargets = await repository.save(targets);
  return savedTargets;
}
