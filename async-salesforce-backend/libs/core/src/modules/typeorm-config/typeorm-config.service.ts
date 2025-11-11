import { ENVIRONMENT } from '@app/core/modules/type-config/types/config.type';
import { SnakeNamingStrategy } from '@app/core/modules/typeorm-config/strategies/snake-naming.strategy';
import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { resolve } from 'path';
import { Client, ClientConfig, DatabaseError } from 'pg';

import { TypeConfigService } from '../type-config/type-config.service';
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(TypeOrmConfigService.name);

  constructor(private readonly configService: TypeConfigService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const option: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.database'),
      schema: this.configService.get('database.schema'),
      namingStrategy: new SnakeNamingStrategy(),
      entities: [resolve(process.cwd(), 'dist/**/*.entity.{ts,js}')],
      synchronize: false,
      logging:
        this.configService.get('app.nodeEnv') === ENVIRONMENT.Development,
    };

    await this.isConnected();

    return option;
  }

  private async isConnected() {
    const options: ClientConfig = {
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      user: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.database'),
    };

    try {
      this.logger.log('Checking database connection...');

      await this.connectToDatabase(options, async (client) => {
        await this.createSchema(client);
      });

      this.logger.log('Database connection successful');
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '3D000') {
        await this.connectToDatabase(
          {
            ...options,
            database: 'postgres',
          },
          async (client) => {
            await this.createDatabase(client, options);
            await this.createSchema(client);
          },
        );

        return;
      }

      throw error;
    }
  }

  private async connectToDatabase(
    options: ClientConfig,
    tasks: (client: Client) => Promise<void>,
  ) {
    const client = new Client(options);
    await client.connect();

    await tasks(client);

    await client.end();
  }

  private async createDatabase(client: Client, options: ClientConfig) {
    await client.query(`CREATE DATABASE "${options.database}"`);

    this.logger.log('Database created successfully');

    return;
  }

  private async createSchema(client: Client) {
    await client.query(
      `CREATE SCHEMA IF NOT EXISTS "${this.configService.get('database.schema')}"`,
    );

    this.logger.log('Schema created successfully');

    return;
  }
}
