import { DataSource } from 'typeorm';

import { clearDatabase } from './seeders/clear-database.seeder';
import { seedFieldMappings } from './seeders/field-mapping.seeder';
import { seedFiles } from './seeders/file.seeder';
import { seedObjectMappings } from './seeders/object-mapping.seeder';
import { seedPermissions } from './seeders/permission.seeder';
import { seedProjects } from './seeders/project.seeder';
import { seedProjectMembers } from './seeders/project-member.seeder';
import { seedRoles } from './seeders/role.seeder';
import { seedSfFieldsCatalog } from './seeders/sf-fields-catalog.seeder';
import { seedSfObjectsCatalog } from './seeders/sf-objects-catalog.seeder';
import { seedSources } from './seeders/source.seeder';
import { seedSourceSettings } from './seeders/source-setting.seeder';
import { seedSyncJobs } from './seeders/sync-job.seeder';
import { seedSyncRuns } from './seeders/sync-run.seeder';
import { seedTargets } from './seeders/target.seeder';
import { seedTypeDictionary } from './seeders/type-dictionary.seeder';
import { seedUsers } from './seeders/user.seeder';

export class Seeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('🌱 Starting database seeding...');

    try {
      // Clear existing data (optional - comment out if you want to keep existing data)
      await clearDatabase(this.dataSource);

      // Seed in order of dependencies
      const permissions = await seedPermissions(this.dataSource);
      const roles = await seedRoles(this.dataSource, permissions);
      const users = await seedUsers(this.dataSource, roles);
      const projects = await seedProjects(this.dataSource);
      const projectMembers = await seedProjectMembers(
        this.dataSource,
        projects,
        users,
      );
      const sources = await seedSources(this.dataSource, projects);
      const sourceSettings = await seedSourceSettings(this.dataSource, sources);
      const targets = await seedTargets(this.dataSource, projects);
      const typeDictionary = await seedTypeDictionary(this.dataSource);
      const sfObjectsCatalog = await seedSfObjectsCatalog(
        this.dataSource,
        sources,
      );
      const sfFieldsCatalog = await seedSfFieldsCatalog(
        this.dataSource,
        sfObjectsCatalog,
      );
      const objectMappings = await seedObjectMappings(
        this.dataSource,
        sources,
        targets,
      );
      const fieldMappings = await seedFieldMappings(
        this.dataSource,
        objectMappings,
      );
      const syncJobs = await seedSyncJobs(this.dataSource, sources, targets);
      const syncRuns = await seedSyncRuns(this.dataSource, syncJobs);
      const files = await seedFiles(this.dataSource, users);

      console.log('✅ Database seeding completed successfully!');
      console.log(`   - ${permissions.length} permissions`);
      console.log(`   - ${roles.length} roles`);
      console.log(`   - ${users.length} users`);
      console.log(`   - ${projects.length} projects`);
      console.log(`   - ${projectMembers.length} project members`);
      console.log(`   - ${sources.length} sources`);
      console.log(`   - ${sourceSettings.length} source settings`);
      console.log(`   - ${targets.length} targets`);
      console.log(`   - ${typeDictionary.length} type dictionary entries`);
      console.log(`   - ${sfObjectsCatalog.length} SF objects catalog`);
      console.log(`   - ${sfFieldsCatalog.length} SF fields catalog`);
      console.log(`   - ${objectMappings.length} object mappings`);
      console.log(`   - ${fieldMappings.length} field mappings`);
      console.log(`   - ${syncJobs.length} sync jobs`);
      console.log(`   - ${syncRuns.length} sync runs`);
      console.log(`   - ${files.length} files`);
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }
}
