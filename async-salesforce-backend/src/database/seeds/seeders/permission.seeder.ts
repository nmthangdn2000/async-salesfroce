import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';
import { DataSource } from 'typeorm';

export async function seedPermissions(
  dataSource: DataSource,
): Promise<PermissionEntity[]> {
  console.log('📝 Seeding permissions...');
  const repository = dataSource.getRepository(PermissionEntity);

  const permissions = [
    {
      code: 1001,
      key: 'user.create',
      name: 'Create User',
      description: 'Permission to create new users',
      module: 'user',
    },
    {
      code: 1002,
      key: 'user.read',
      name: 'Read User',
      description: 'Permission to read user information',
      module: 'user',
    },
    {
      code: 1003,
      key: 'user.update',
      name: 'Update User',
      description: 'Permission to update user information',
      module: 'user',
    },
    {
      code: 1004,
      key: 'user.delete',
      name: 'Delete User',
      description: 'Permission to delete users',
      module: 'user',
    },
    {
      code: 2001,
      key: 'project.create',
      name: 'Create Project',
      description: 'Permission to create new projects',
      module: 'project',
    },
    {
      code: 2002,
      key: 'project.read',
      name: 'Read Project',
      description: 'Permission to read project information',
      module: 'project',
    },
    {
      code: 2003,
      key: 'project.update',
      name: 'Update Project',
      description: 'Permission to update project information',
      module: 'project',
    },
    {
      code: 2004,
      key: 'project.delete',
      name: 'Delete Project',
      description: 'Permission to delete projects',
      module: 'project',
    },
    {
      code: 3001,
      key: 'source.create',
      name: 'Create Source',
      description: 'Permission to create new sources',
      module: 'source',
    },
    {
      code: 3002,
      key: 'source.read',
      name: 'Read Source',
      description: 'Permission to read source information',
      module: 'source',
    },
    {
      code: 3003,
      key: 'source.update',
      name: 'Update Source',
      description: 'Permission to update source information',
      module: 'source',
    },
    {
      code: 3004,
      key: 'source.delete',
      name: 'Delete Source',
      description: 'Permission to delete sources',
      module: 'source',
    },
    {
      code: 4001,
      key: 'sync.create',
      name: 'Create Sync Job',
      description: 'Permission to create sync jobs',
      module: 'sync',
    },
    {
      code: 4002,
      key: 'sync.read',
      name: 'Read Sync Job',
      description: 'Permission to read sync job information',
      module: 'sync',
    },
    {
      code: 4003,
      key: 'sync.update',
      name: 'Update Sync Job',
      description: 'Permission to update sync jobs',
      module: 'sync',
    },
    {
      code: 4004,
      key: 'sync.delete',
      name: 'Delete Sync Job',
      description: 'Permission to delete sync jobs',
      module: 'sync',
    },
  ];

  const savedPermissions = await repository.save(permissions);
  return savedPermissions;
}
