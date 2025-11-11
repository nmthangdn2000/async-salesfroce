import { randomUUID } from 'crypto';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { DataSource } from 'typeorm';

export async function seedProjects(
  dataSource: DataSource,
): Promise<ProjectEntity[]> {
  console.log('📁 Seeding projects...');
  const repository = dataSource.getRepository(ProjectEntity);

  const projects = [
    {
      id: randomUUID(),
      name: 'Salesforce Integration Project',
      slug: 'salesforce-integration',
    },
    {
      id: randomUUID(),
      name: 'Data Warehouse Sync',
      slug: 'data-warehouse-sync',
    },
    {
      id: randomUUID(),
      name: 'Customer Analytics',
      slug: 'customer-analytics',
    },
  ];

  const savedProjects = await repository.save(projects);
  return savedProjects;
}
