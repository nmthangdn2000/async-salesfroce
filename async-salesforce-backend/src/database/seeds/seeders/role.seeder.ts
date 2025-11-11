import { randomUUID } from 'crypto';
import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { DataSource } from 'typeorm';

export async function seedRoles(
  dataSource: DataSource,
  permissions: PermissionEntity[],
): Promise<RoleEntity[]> {
  console.log('👥 Seeding roles...');
  const repository = dataSource.getRepository(RoleEntity);

  const roles = [
    {
      id: randomUUID(),
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: permissions, // All permissions
    },
    {
      id: randomUUID(),
      name: 'Admin',
      description: 'Administrative access to projects and sources',
      permissions: permissions.filter(
        (p) => p.module === 'project' || p.module === 'source',
      ),
    },
    {
      id: randomUUID(),
      name: 'Project Manager',
      description: 'Can manage projects and sync jobs',
      permissions: permissions.filter(
        (p) =>
          p.module === 'project' || (p.module === 'sync' && p.code !== 4004),
      ),
    },
    {
      id: randomUUID(),
      name: 'Developer',
      description: 'Can read and update projects and sources',
      permissions: permissions.filter(
        (p) =>
          (p.module === 'project' && [2002, 2003].includes(p.code)) ||
          (p.module === 'source' && [3002, 3003].includes(p.code)),
      ),
    },
    {
      id: randomUUID(),
      name: 'Viewer',
      description: 'Read-only access',
      permissions: permissions.filter((p) => p.key.includes('.read')),
    },
  ];

  const savedRoles = await repository.save(roles);
  return savedRoles;
}
