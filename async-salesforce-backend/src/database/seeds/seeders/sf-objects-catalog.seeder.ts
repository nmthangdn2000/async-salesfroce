import { SOURCE_PROVIDER } from '@app/shared/models/source.model';
import { randomUUID } from 'crypto';
import { SfObjectsCatalogEntity } from 'src/modules/catalog/entities/sf-objects-catalog.entity';
import { SourceEntity } from 'src/modules/source/entities/source.entity';
import { DataSource } from 'typeorm';

export async function seedSfObjectsCatalog(
  dataSource: DataSource,
  sources: SourceEntity[],
): Promise<SfObjectsCatalogEntity[]> {
  console.log('📦 Seeding SF objects catalog...');
  const repository = dataSource.getRepository(SfObjectsCatalogEntity);

  const commonObjects = ['Account', 'Contact', 'Opportunity', 'Lead', 'Case'];
  const catalog: SfObjectsCatalogEntity[] = [];

  for (const source of sources.filter(
    (s) => s.provider === SOURCE_PROVIDER.SALESFORCE,
  )) {
    for (const objectName of commonObjects) {
      catalog.push(
        repository.create({
          id: randomUUID(),
          sourceId: source.id,
          apiName: objectName,
          label: `${objectName} Object`,
          isSelected: objectName === 'Account' || objectName === 'Contact',
          selectedBy: source.id,
          selectedAt: new Date(),
        }),
      );
    }
  }

  const savedCatalog = await repository.save(catalog);
  return savedCatalog;
}
