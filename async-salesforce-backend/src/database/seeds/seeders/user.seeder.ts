import { hash } from '@app/common/utils/bcrypt.util';
import { USER_STATUS } from '@app/shared/models/user.model';
import { randomUUID } from 'crypto';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DataSource } from 'typeorm';

export async function seedUsers(
  dataSource: DataSource,
  roles: RoleEntity[],
): Promise<UserEntity[]> {
  console.log('👤 Seeding users...');
  const repository = dataSource.getRepository(UserEntity);

  const defaultPassword = await hash('password123');

  const usersData = [
    {
      id: randomUUID(),
      email: 'admin@example.com',
      password: defaultPassword,
      status: USER_STATUS.ACTIVE,
      roles: [roles.find((r) => r.name === 'Super Admin')!],
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        gender: 'male',
        dob: new Date('1990-01-01'),
        bio: 'System Administrator',
        address: '123 Admin Street',
      },
    },
    {
      id: randomUUID(),
      email: 'manager@example.com',
      password: defaultPassword,
      status: USER_STATUS.ACTIVE,
      roles: [roles.find((r) => r.name === 'Project Manager')!],
      profile: {
        firstName: 'Project',
        lastName: 'Manager',
        phone: '+1234567891',
        gender: 'female',
        dob: new Date('1985-05-15'),
        bio: 'Project Manager',
        address: '456 Manager Avenue',
      },
    },
    {
      id: randomUUID(),
      email: 'developer@example.com',
      password: defaultPassword,
      status: USER_STATUS.ACTIVE,
      roles: [roles.find((r) => r.name === 'Developer')!],
      profile: {
        firstName: 'John',
        lastName: 'Developer',
        phone: '+1234567892',
        gender: 'male',
        dob: new Date('1992-08-20'),
        bio: 'Software Developer',
        address: '789 Dev Road',
      },
    },
    {
      id: randomUUID(),
      email: 'viewer@example.com',
      password: defaultPassword,
      status: USER_STATUS.ACTIVE,
      roles: [roles.find((r) => r.name === 'Viewer')!],
      profile: {
        firstName: 'Jane',
        lastName: 'Viewer',
        phone: '+1234567893',
        gender: 'female',
        dob: new Date('1995-03-10'),
        bio: 'Data Viewer',
        address: '321 View Street',
      },
    },
  ];

  const savedUsers: UserEntity[] = [];
  for (const userData of usersData) {
    const user = await repository.save({
      id: userData.id,
      email: userData.email,
      password: userData.password,
      status: userData.status,
      roles: userData.roles,
      profile: {
        ...userData.profile,
        userId: userData.id,
      },
    });
    savedUsers.push(user);
  }

  return savedUsers;
}
