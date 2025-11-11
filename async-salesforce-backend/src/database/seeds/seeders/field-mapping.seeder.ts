import { randomUUID } from 'crypto';
import { FieldMappingEntity } from 'src/modules/mapping/entities/field-mapping.entity';
import { ObjectMappingEntity } from 'src/modules/mapping/entities/object-mapping.entity';
import { DataSource } from 'typeorm';

export async function seedFieldMappings(
  dataSource: DataSource,
  objectMappings: ObjectMappingEntity[],
): Promise<FieldMappingEntity[]> {
  console.log('🔗 Seeding field mappings...');
  const repository = dataSource.getRepository(FieldMappingEntity);

  const fieldMappings: FieldMappingEntity[] = [];

  for (const objMapping of objectMappings) {
    const fieldMap: Record<
      string,
      Record<string, { targetColumn: string; logicalType: string }>
    > = {
      Account: {
        Id: { targetColumn: 'id', logicalType: 'string' },
        Name: { targetColumn: 'name', logicalType: 'string' },
        Industry: { targetColumn: 'industry', logicalType: 'string' },
        AnnualRevenue: {
          targetColumn: 'annual_revenue',
          logicalType: 'decimal',
        },
        CreatedDate: {
          targetColumn: 'created_date',
          logicalType: 'timestamp',
        },
      },
      Contact: {
        Id: { targetColumn: 'id', logicalType: 'string' },
        FirstName: { targetColumn: 'first_name', logicalType: 'string' },
        LastName: { targetColumn: 'last_name', logicalType: 'string' },
        Email: { targetColumn: 'email', logicalType: 'string' },
        Phone: { targetColumn: 'phone', logicalType: 'string' },
        CreatedDate: {
          targetColumn: 'created_date',
          logicalType: 'timestamp',
        },
      },
    };

    const fields = fieldMap[objMapping.objectApiName];
    if (fields) {
      for (const [sfField, mapping] of Object.entries(fields)) {
        fieldMappings.push(
          repository.create({
            id: randomUUID(),
            objectMappingId: objMapping.id,
            sfFieldApiName: sfField,
            targetColumn: mapping.targetColumn,
            logicalType: mapping.logicalType,
          }),
        );
      }
    }
  }

  const savedMappings = await repository.save(fieldMappings);
  return savedMappings;
}
