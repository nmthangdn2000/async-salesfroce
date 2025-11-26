import { TBase } from '@app/shared/models/base.model';
import { TProject } from '@app/shared/models/project.model';

export enum TARGET_KIND {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  SQLSERVER = 'sqlserver',
  BIGQUERY = 'bigquery',
  SNOWFLAKE = 'snowflake',
  CLICKHOUSE = 'clickhouse',
  MONGODB = 'mongodb',
}

export type TTarget = TBase & {
  projectId: string;
  kind: TARGET_KIND;
  name: string;
  // Connection fields (merged from target_connections)
  connectInfo?: Record<string, any>;
  secretsRef?: string;
  // Database connection fields
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  schema?: string;
  ssl: boolean;
  sslMode?: string;
  connectionString?: string;
  project: TProject;
  objectMappings: any[]; // TObjectMapping - forward reference
  syncJobs: any[]; // TSyncJob - forward reference
};
