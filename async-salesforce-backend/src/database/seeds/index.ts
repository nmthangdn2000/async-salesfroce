import { DataSource } from 'typeorm';

export class Seeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('🌱 Starting database seeding...');

    try {
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }
}
