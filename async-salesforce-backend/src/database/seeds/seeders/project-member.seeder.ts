import { PROJECT_MEMBER_ROLE } from '@app/shared/models/project.model';
import { randomUUID } from 'crypto';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { ProjectMemberEntity } from 'src/modules/project-member/entities/project-member.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DataSource } from 'typeorm';

export async function seedProjectMembers(
  dataSource: DataSource,
  projects: ProjectEntity[],
  users: UserEntity[],
): Promise<ProjectMemberEntity[]> {
  console.log('👥 Seeding project members...');
  const repository = dataSource.getRepository(ProjectMemberEntity);

  const projectMembers = [
    {
      id: randomUUID(),
      projectId: projects[0].id,
      userId: users[0].id,
      role: PROJECT_MEMBER_ROLE.OWNER,
    },
    {
      id: randomUUID(),
      projectId: projects[0].id,
      userId: users[1].id,
      role: PROJECT_MEMBER_ROLE.ADMIN,
    },
    {
      id: randomUUID(),
      projectId: projects[0].id,
      userId: users[2].id,
      role: PROJECT_MEMBER_ROLE.EDITOR,
    },
    {
      id: randomUUID(),
      projectId: projects[1].id,
      userId: users[0].id,
      role: PROJECT_MEMBER_ROLE.OWNER,
    },
    {
      id: randomUUID(),
      projectId: projects[1].id,
      userId: users[1].id,
      role: PROJECT_MEMBER_ROLE.ADMIN,
    },
    {
      id: randomUUID(),
      projectId: projects[2].id,
      userId: users[0].id,
      role: PROJECT_MEMBER_ROLE.OWNER,
    },
    {
      id: randomUUID(),
      projectId: projects[2].id,
      userId: users[3].id,
      role: PROJECT_MEMBER_ROLE.VIEWER,
    },
  ];

  const savedMembers = await repository.save(projectMembers);
  return savedMembers;
}
