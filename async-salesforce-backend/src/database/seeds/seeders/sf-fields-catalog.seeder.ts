import { randomUUID } from 'crypto';
import { SfFieldsCatalogEntity } from 'src/modules/catalog/entities/sf-fields-catalog.entity';
import { SfObjectsCatalogEntity } from 'src/modules/catalog/entities/sf-objects-catalog.entity';
import { DataSource } from 'typeorm';

export async function seedSfFieldsCatalog(
  dataSource: DataSource,
  objects: SfObjectsCatalogEntity[],
): Promise<SfFieldsCatalogEntity[]> {
  console.log('📋 Seeding SF fields catalog...');
  const repository = dataSource.getRepository(SfFieldsCatalogEntity);

  const commonFields: Record<
    string,
    Array<{
      apiName: string;
      label: string;
      sfType: string;
      isRequired?: boolean;
    }>
  > = {
    Account: [
      { apiName: 'Id', label: 'Record ID', sfType: 'Id', isRequired: true },
      {
        apiName: 'Name',
        label: 'Account Name',
        sfType: 'String',
        isRequired: true,
      },
      { apiName: 'Industry', label: 'Industry', sfType: 'String' },
      {
        apiName: 'AnnualRevenue',
        label: 'Annual Revenue',
        sfType: 'Double',
      },
      { apiName: 'CreatedDate', label: 'Created Date', sfType: 'DateTime' },
    ],
    Contact: [
      { apiName: 'Id', label: 'Record ID', sfType: 'Id', isRequired: true },
      { apiName: 'FirstName', label: 'First Name', sfType: 'String' },
      {
        apiName: 'LastName',
        label: 'Last Name',
        sfType: 'String',
        isRequired: true,
      },
      { apiName: 'Email', label: 'Email', sfType: 'String' },
      { apiName: 'Phone', label: 'Phone', sfType: 'String' },
      { apiName: 'CreatedDate', label: 'Created Date', sfType: 'DateTime' },
    ],
    Opportunity: [
      { apiName: 'Id', label: 'Record ID', sfType: 'Id', isRequired: true },
      {
        apiName: 'Name',
        label: 'Opportunity Name',
        sfType: 'String',
        isRequired: true,
      },
      { apiName: 'Amount', label: 'Amount', sfType: 'Double' },
      { apiName: 'StageName', label: 'Stage', sfType: 'String' },
      { apiName: 'CloseDate', label: 'Close Date', sfType: 'Date' },
    ],
    Lead: [
      { apiName: 'Id', label: 'Record ID', sfType: 'Id', isRequired: true },
      { apiName: 'FirstName', label: 'First Name', sfType: 'String' },
      {
        apiName: 'LastName',
        label: 'Last Name',
        sfType: 'String',
        isRequired: true,
      },
      { apiName: 'Email', label: 'Email', sfType: 'String' },
      { apiName: 'Company', label: 'Company', sfType: 'String' },
    ],
    Case: [
      { apiName: 'Id', label: 'Record ID', sfType: 'Id', isRequired: true },
      {
        apiName: 'Subject',
        label: 'Subject',
        sfType: 'String',
        isRequired: true,
      },
      { apiName: 'Status', label: 'Status', sfType: 'String' },
      { apiName: 'Priority', label: 'Priority', sfType: 'String' },
      { apiName: 'CreatedDate', label: 'Created Date', sfType: 'DateTime' },
    ],
  };

  const fields: SfFieldsCatalogEntity[] = [];

  for (const obj of objects) {
    const objectFields = commonFields[obj.apiName] || [];
    for (const field of objectFields) {
      fields.push(
        repository.create({
          id: randomUUID(),
          objectId: obj.id,
          apiName: field.apiName,
          label: field.label,
          sfType: field.sfType,
          isRequired: field.isRequired || false,
          length: field.sfType === 'String' ? 255 : undefined,
          isSelected:
            obj.isSelected &&
            ['Id', 'Name', 'Email', 'CreatedDate'].includes(field.apiName),
          selectedBy: obj.isSelected ? obj.selectedBy : undefined,
          selectedAt: obj.isSelected ? obj.selectedAt : undefined,
        }),
      );
    }
  }

  const savedFields = await repository.save(fields);
  return savedFields;
}
