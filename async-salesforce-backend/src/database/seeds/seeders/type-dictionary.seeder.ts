import { randomUUID } from 'crypto';
import { TypeDictionaryEntity } from 'src/modules/dictionary/entities/type-dictionary.entity';
import { DataSource } from 'typeorm';

export async function seedTypeDictionary(
  dataSource: DataSource,
): Promise<TypeDictionaryEntity[]> {
  console.log('📚 Seeding type dictionary...');
  const repository = dataSource.getRepository(TypeDictionaryEntity);

  const typeDictionary = [
    {
      id: randomUUID(),
      sfType: 'String',
      logicalType: 'string',
      pgType: 'VARCHAR',
      mysqlType: 'VARCHAR',
      sqlserverType: 'NVARCHAR',
      bigqueryType: 'STRING',
      snowflakeType: 'VARCHAR',
      clickhouseType: 'String',
    },
    {
      id: randomUUID(),
      sfType: 'Text',
      logicalType: 'text',
      pgType: 'TEXT',
      mysqlType: 'TEXT',
      sqlserverType: 'NVARCHAR(MAX)',
      bigqueryType: 'STRING',
      snowflakeType: 'TEXT',
      clickhouseType: 'String',
    },
    {
      id: randomUUID(),
      sfType: 'Int',
      logicalType: 'integer',
      pgType: 'INTEGER',
      mysqlType: 'INT',
      sqlserverType: 'INT',
      bigqueryType: 'INT64',
      snowflakeType: 'INTEGER',
      clickhouseType: 'Int32',
    },
    {
      id: randomUUID(),
      sfType: 'Double',
      logicalType: 'decimal',
      pgType: 'DECIMAL',
      mysqlType: 'DECIMAL',
      sqlserverType: 'DECIMAL',
      bigqueryType: 'NUMERIC',
      snowflakeType: 'DECIMAL',
      clickhouseType: 'Decimal64',
    },
    {
      id: randomUUID(),
      sfType: 'Date',
      logicalType: 'date',
      pgType: 'DATE',
      mysqlType: 'DATE',
      sqlserverType: 'DATE',
      bigqueryType: 'DATE',
      snowflakeType: 'DATE',
      clickhouseType: 'Date',
    },
    {
      id: randomUUID(),
      sfType: 'DateTime',
      logicalType: 'timestamp',
      pgType: 'TIMESTAMP',
      mysqlType: 'DATETIME',
      sqlserverType: 'DATETIME2',
      bigqueryType: 'TIMESTAMP',
      snowflakeType: 'TIMESTAMP_NTZ',
      clickhouseType: 'DateTime',
    },
    {
      id: randomUUID(),
      sfType: 'Boolean',
      logicalType: 'boolean',
      pgType: 'BOOLEAN',
      mysqlType: 'BOOLEAN',
      sqlserverType: 'BIT',
      bigqueryType: 'BOOL',
      snowflakeType: 'BOOLEAN',
      clickhouseType: 'UInt8',
    },
  ];

  const savedDictionary = await repository.save(typeDictionary);
  return savedDictionary;
}
