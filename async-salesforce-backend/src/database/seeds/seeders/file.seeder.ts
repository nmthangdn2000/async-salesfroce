import { randomUUID } from 'crypto';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DataSource } from 'typeorm';

export async function seedFiles(
  dataSource: DataSource,
  users: UserEntity[],
): Promise<FileEntity[]> {
  console.log('📄 Seeding files...');
  const repository = dataSource.getRepository(FileEntity);

  const files = [
    {
      id: randomUUID(),
      userId: users[0].id,
      name: 'profile-avatar.jpg',
      path: '/uploads/avatars/profile-avatar.jpg',
      size: 102400,
      type: 'image/jpeg',
      url: 'https://example.com/uploads/avatars/profile-avatar.jpg',
    },
    {
      id: randomUUID(),
      userId: users[1].id,
      name: 'document.pdf',
      path: '/uploads/documents/document.pdf',
      size: 204800,
      type: 'application/pdf',
      url: 'https://example.com/uploads/documents/document.pdf',
    },
    {
      id: randomUUID(),
      userId: users[2].id,
      name: 'report.xlsx',
      path: '/uploads/reports/report.xlsx',
      size: 512000,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      url: 'https://example.com/uploads/reports/report.xlsx',
    },
  ];

  const savedFiles = await repository.save(files);
  return savedFiles;
}
