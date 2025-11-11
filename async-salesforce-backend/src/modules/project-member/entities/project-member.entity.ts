import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import {
  PROJECT_MEMBER_ROLE,
  TProjectMember,
} from '@app/shared/models/project.model';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { ProjectEntity } from '../../project/entities/project.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('project_members')
@Unique(['projectId', 'userId'])
@Index('idx_project_members_project', ['projectId'])
@Index('idx_project_members_user', ['userId'])
export class ProjectMemberEntity extends BaseEntity implements TProjectMember {
  @Column({ type: 'uuid', nullable: false })
  projectId!: string;

  @Column({ type: 'uuid', nullable: false })
  userId!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  role!: PROJECT_MEMBER_ROLE;

  // relations
  @ManyToOne(() => ProjectEntity, (project) => project.projectMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}

