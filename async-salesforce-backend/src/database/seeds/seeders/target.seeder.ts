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

  const targets = projects.flatMap((project, projectIndex) => {
    const projectTargets = [];

    // PostgreSQL target
    const postgresId = randomUUID();
    projectTargets.push({
      id: postgresId,
      projectId: project.id,
      kind: TARGET_KIND.POSTGRES,
      name: `PostgreSQL Warehouse ${projectIndex + 1}`,
      // Connection fields
      connectInfo: {
        host: `db-postgres-${projectIndex + 1}.example.com`,
        port: 5432,
        database: `warehouse_${postgresId.substring(0, 8)}`,
        ssl: true,
      },
      secretsRef: `target-secret-${postgresId}`,
      host: `db-postgres-${projectIndex + 1}.example.com`,
      port: 5432,
      database: `warehouse_${postgresId.substring(0, 8)}`,
      username: `user_${postgresId.substring(0, 8)}`,
      schema: 'public',
      ssl: true,
      sslMode: 'require',
    });

    // BigQuery target
    const bigqueryId = randomUUID();
    projectTargets.push({
      id: bigqueryId,
      projectId: project.id,
      kind: TARGET_KIND.BIGQUERY,
      name: `BigQuery Analytics ${projectIndex + 1}`,
      // Connection fields
      connectInfo: {
        project: `bigquery-project-${projectIndex + 1}`,
        dataset: `analytics_${bigqueryId.substring(0, 8)}`,
      },
      secretsRef: `target-secret-${bigqueryId}`,
      connectionString: `bigquery://bigquery-project-${projectIndex + 1}/analytics_${bigqueryId.substring(0, 8)}`,
      ssl: false,
    });

    // Snowflake target (for first 2 projects)
    if (projectIndex < 2) {
      const snowflakeId = randomUUID();
      projectTargets.push({
        id: snowflakeId,
        projectId: project.id,
        kind: TARGET_KIND.SNOWFLAKE,
        name: `Snowflake Data Lake ${projectIndex + 1}`,
        // Connection fields
        connectInfo: {
          account: `snowflake-account-${projectIndex + 1}`,
          warehouse: `COMPUTE_WH`,
          database: `SNOWFLAKE_DB_${projectIndex + 1}`,
          schema: 'PUBLIC',
        },
        secretsRef: `target-secret-${snowflakeId}`,
        connectionString: `snowflake://snowflake-account-${projectIndex + 1}.snowflakecomputing.com/?warehouse=COMPUTE_WH&db=SNOWFLAKE_DB_${projectIndex + 1}&schema=PUBLIC`,
        ssl: true,
      });
    }

    // MySQL target (for last project)
    if (projectIndex === projects.length - 1) {
      const mysqlId = randomUUID();
      projectTargets.push({
        id: mysqlId,
        projectId: project.id,
        kind: TARGET_KIND.MYSQL,
        name: `MySQL Database ${projectIndex + 1}`,
        // Connection fields
        connectInfo: {
          host: `db-mysql-${projectIndex + 1}.example.com`,
          port: 3306,
          database: `mysql_db_${mysqlId.substring(0, 8)}`,
          ssl: true,
        },
        secretsRef: `target-secret-${mysqlId}`,
        host: `db-mysql-${projectIndex + 1}.example.com`,
        port: 3306,
        database: `mysql_db_${mysqlId.substring(0, 8)}`,
        username: `user_${mysqlId.substring(0, 8)}`,
        ssl: true,
      });
    }

    return projectTargets;
  });

  const savedTargets = await repository.save(targets);
  return savedTargets;
}
