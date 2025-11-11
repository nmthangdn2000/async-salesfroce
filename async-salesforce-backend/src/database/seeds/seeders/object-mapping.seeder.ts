import { PK_STRATEGY } from '@app/shared/models/mapping.model';
import { randomUUID } from 'crypto';
import { ObjectMappingEntity } from 'src/modules/mapping/entities/object-mapping.entity';
import { SourceEntity } from 'src/modules/source/entities/source.entity';
import { TargetEntity } from 'src/modules/target/entities/target.entity';
import { DataSource } from 'typeorm';

export async function seedObjectMappings(
  dataSource: DataSource,
  sources: SourceEntity[],
  targets: TargetEntity[],
): Promise<ObjectMappingEntity[]> {
  console.log('🗺️  Seeding object mappings...');
  const repository = dataSource.getRepository(ObjectMappingEntity);

  const mappings: ObjectMappingEntity[] = [];
  const source = sources[0]; // Use first source
  const target = targets[0]; // Use first target

  const objectMappings = [
    {
      objectApiName: 'Account',
      targetTable: 'accounts',
      pkStrategy: PK_STRATEGY.SF_ID,
    },
    {
      objectApiName: 'Contact',
      targetTable: 'contacts',
      pkStrategy: PK_STRATEGY.SF_ID,
    },
  ];

  for (const mapping of objectMappings) {
    mappings.push(
      repository.create({
        id: randomUUID(),
        sourceId: source.id,
        objectApiName: mapping.objectApiName,
        targetId: target.id,
        targetTable: mapping.targetTable,
        pkStrategy: mapping.pkStrategy,
      }),
    );
  }

  const savedMappings = await repository.save(mappings);
  return savedMappings;
}
