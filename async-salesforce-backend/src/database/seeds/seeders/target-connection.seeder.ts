import { TARGET_KIND } from '@app/shared/models/target.model';
import { randomUUID } from 'crypto';
import { TargetEntity } from 'src/modules/target/entities/target.entity';
import { TargetConnectionEntity } from 'src/modules/target/entities/target-connection.entity';
import { DataSource } from 'typeorm';

export async function seedTargetConnections(
  dataSource: DataSource,
  targets: TargetEntity[],
): Promise<TargetConnectionEntity[]> {
  console.log('🔗 Seeding target connections...');
  const repository = dataSource.getRepository(TargetConnectionEntity);

  const connections = targets.map((target) => ({
    id: randomUUID(),
    targetId: target.id,
    connectInfo: {
      host: `db-${target.kind}.example.com`,
      port: target.kind === TARGET_KIND.POSTGRES ? 5432 : 3306,
      database: `warehouse_${target.id.substring(0, 8)}`,
      ssl: true,
    },
    secretsRef: `target-secret-${target.id}`,
  }));

  const savedConnections = await repository.save(connections);
  return savedConnections;
}
