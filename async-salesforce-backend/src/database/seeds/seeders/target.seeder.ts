import { TARGET_KIND, CONNECTION_TYPE } from '@app/shared/models/target.model';
import { randomUUID } from 'crypto';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { SourceEntity } from 'src/modules/source/entities/source.entity';
import { TargetEntity } from 'src/modules/target/entities/target.entity';
import { DataSource } from 'typeorm';

export async function seedTargets(
  dataSource: DataSource,
  projects: ProjectEntity[],
  sources: SourceEntity[],
): Promise<TargetEntity[]> {
  console.log('🎯 Seeding targets...');
  const repository = dataSource.getRepository(TargetEntity);

  const targets = projects.flatMap((project) => {
    // Get sources for this project
    const projectSources = sources.filter((s) => s.projectId === project.id);
    
    return projectSources.map((source, index) => {
      const targetId = randomUUID();
      const kindIndex = index % 4;
      
      // PostgreSQL target
      if (kindIndex === 0) {
        return {
          id: targetId,
          projectId: project.id,
          sourceId: source.id,
          kind: TARGET_KIND.POSTGRES,
          name: `PostgreSQL Warehouse ${index + 1}`,
          connectionType: 'host' as CONNECTION_TYPE,
          host: `db-postgres-${index + 1}.example.com`,
          port: 5432,
          database: `warehouse_${targetId.substring(0, 8)}`,
          username: `user_${targetId.substring(0, 8)}`,
          schema: 'public',
          ssl: true,
          sslMode: 'require',
        };
      }
      
      // BigQuery target
      if (kindIndex === 1) {
        return {
          id: targetId,
          projectId: project.id,
          sourceId: source.id,
          kind: TARGET_KIND.BIGQUERY,
          name: `BigQuery Analytics ${index + 1}`,
          connectionType: 'url' as CONNECTION_TYPE,
          connectionString: `bigquery://bigquery-project-${index + 1}/analytics_${targetId.substring(0, 8)}`,
          ssl: false,
        };
      }
      
      // Snowflake target
      if (kindIndex === 2) {
        return {
          id: targetId,
          projectId: project.id,
          sourceId: source.id,
          kind: TARGET_KIND.SNOWFLAKE,
          name: `Snowflake Data Lake ${index + 1}`,
          connectionType: 'url' as CONNECTION_TYPE,
          connectionString: `snowflake://snowflake-account-${index + 1}.snowflakecomputing.com/?warehouse=COMPUTE_WH&db=SNOWFLAKE_DB_${index + 1}&schema=PUBLIC`,
          ssl: true,
        };
      }
      
      // MySQL target
      return {
        id: targetId,
        projectId: project.id,
        sourceId: source.id,
        kind: TARGET_KIND.MYSQL,
        name: `MySQL Database ${index + 1}`,
        connectionType: 'host' as CONNECTION_TYPE,
        host: `db-mysql-${index + 1}.example.com`,
        port: 3306,
        database: `mysql_db_${targetId.substring(0, 8)}`,
        username: `user_${targetId.substring(0, 8)}`,
        ssl: true,
      };
    });
  });

  const savedTargets = await repository.save(targets);
  return savedTargets;
}
