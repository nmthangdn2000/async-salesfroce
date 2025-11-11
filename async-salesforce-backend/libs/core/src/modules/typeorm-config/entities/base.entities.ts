import { TBase } from '@app/shared/models/base.model';
import {
  BaseEntity as BaseEntityTypeORM,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity extends BaseEntityTypeORM implements TBase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  updatedAt!: Date;

  @Column({ nullable: true, type: 'uuid' })
  createdBy?: string;

  @Column({ nullable: true, type: 'uuid' })
  updatedBy?: string;

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    name: 'deleted_at',
  })
  deletedAt?: Date;

  @Column({ nullable: true, type: 'uuid' })
  deletedBy?: string;
}
