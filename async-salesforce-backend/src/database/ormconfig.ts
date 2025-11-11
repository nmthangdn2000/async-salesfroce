import { CoreModule } from '@app/core';
import {
  TypeormConfigModule,
  TypeOrmConfigService,
} from '@app/core/modules/typeorm-config';
import { NestFactory } from '@nestjs/core';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(CoreModule);

  const typeOrmConfig = app
    .select(TypeormConfigModule)
    .get(TypeOrmConfigService);

  const appDataSource = new DataSource({
    ...(await typeOrmConfig.createTypeOrmOptions()),
    entities: [resolve(process.cwd(), 'src/modules/**/*.entity.{ts,js}')],
    migrations: [resolve(process.cwd(), 'src/database/migrations/*.{ts,js}')],
  } as DataSourceOptions);

  await app.close();
  return appDataSource;
};

export default bootstrap();
