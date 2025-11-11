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
  project: TProject;
  targetConnections: TTargetConnection[];
  objectMappings: any[]; // TObjectMapping - forward reference
  syncJobs: any[]; // TSyncJob - forward reference
};

export type TTargetConnection = TBase & {
  targetId: string;
  connectInfo: Record<string, any>;
  secretsRef: string;
  target: TTarget;
};
