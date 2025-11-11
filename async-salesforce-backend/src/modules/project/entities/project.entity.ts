import { BaseEntity } from '@app/core/modules/typeorm-config/entities/base.entities';
import { TProject } from '@app/shared/models/project.model';
import { Column, Entity, OneToMany } from 'typeorm';

import { ProjectMemberEntity } from '../../project-member/entities/project-member.entity';
import { SourceEntity } from '../../source/entities/source.entity';
import { TargetEntity } from '../../target/entities/target.entity';

@Entity('projects')
export class ProjectEntity extends BaseEntity implements TProject {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  slug?: string;

  // relations
  @OneToMany(() => ProjectMemberEntity, (member) => member.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  projectMembers!: ProjectMemberEntity[];

  @OneToMany(() => SourceEntity, (source) => source.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sources!: SourceEntity[];

  @OneToMany(() => TargetEntity, (target) => target.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  targets!: TargetEntity[];
}
