import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { customPlainToInstance } from '@app/common/utils/instance-transform.util';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';
import { ROLE_EVENT_EMITTER } from 'src/modules/role/constants/event-emitter.constant';
import { FilterRoleRequestDto } from 'src/modules/role/dto/request/get-role.dto';
import { CreateRoleRequestDto } from 'src/modules/role/dto/response/create-role.dto';
import {
  GetPaginatedRoleResponseDto,
  GetRoleResponseDto,
} from 'src/modules/role/dto/response/get-role.dto';
import { UpdateRoleRequestDto } from 'src/modules/role/dto/response/update-role.dto';
import { RoleRepository } from 'src/modules/role/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  @OnEvent(ROLE_EVENT_EMITTER.ROLE_INIT)
  async initRoleAdmin(permissions: PermissionEntity[]) {
    const role = await this.roleRepository.findOne({
      where: { name: 'Admin' },
    });

    const roleInstance = this.roleRepository.create({
      id: role?.id || randomUUID(),
      name: 'Admin',
      description: 'Admin role',
      permissions,
    });

    await this.roleRepository.save(roleInstance);
  }

  async create(input: CreateRoleRequestDto) {
    const roleInstance = this.roleRepository.create({
      name: input.name,
      description: input.description,
      permissions: input.permissions.map((permission) => ({
        code: permission,
      })),
    });

    const role = await this.roleRepository.save(roleInstance);

    return customPlainToInstance(GetRoleResponseDto, role);
  }

  async findAll(filter: FilterRoleRequestDto) {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions');

    if (filter.search) {
      queryBuilder.where('role.name LIKE :search', {
        search: `%${filter.search}%`,
      });
    }

    const result = await this.roleRepository.paginate(
      queryBuilder,
      filter,
      GetRoleResponseDto,
    );

    // Get user counts for all roles
    const roleIds = result.items.map((role: any) => role.id);
    const userCounts = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoin('role.users', 'users')
      .select('role.id', 'roleId')
      .addSelect('COUNT(users.id)', 'userCount')
      .where('role.id IN (:...roleIds)', { roleIds })
      .groupBy('role.id')
      .getRawMany<{ roleId: string; userCount: string }>();

    // Map user counts to roles
    const userCountMap = new Map(
      userCounts.map((item) => [item.roleId, Number(item.userCount)]),
    );

    // Add userCount to each role
    const itemsWithUserCount = result.items.map((role: any) => ({
      ...role,
      userCount: userCountMap.get(role.id as string) || 0,
    }));

    return customPlainToInstance(GetPaginatedRoleResponseDto, {
      ...result,
      items: itemsWithUserCount,
    });
  }

  async findOne(id: string) {
    const [role, roleUser] = await Promise.all([
      this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permissions', 'permissions')
        .leftJoin('role.users', 'users')
        .where('role.id = :id', { id })
        .groupBy('role.id, permissions.code')
        .getOne(),

      this.roleRepository
        .createQueryBuilder('role')
        .leftJoin('role.users', 'users')
        .where('role.id = :id', { id })
        .select('COUNT(users.id)', 'userCount')
        .getRawOne<{ userCount: number }>(),
    ]);

    if (!role) {
      throw new CustomHttpException(ERROR_MESSAGES.RoleNotFound);
    }

    const result = { ...role, userCount: Number(roleUser?.userCount || 0) };

    return customPlainToInstance(GetRoleResponseDto, result);
  }

  async update(id: string, input: UpdateRoleRequestDto) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new CustomHttpException(ERROR_MESSAGES.RoleNotFound);
    }

    const roleInstance = this.roleRepository.create({
      ...role,
      ...input,
      permissions: input.permissions?.map((permission) => ({
        code: permission,
      })),
    });

    const updatedRole = await this.roleRepository.save(roleInstance);

    return customPlainToInstance(GetRoleResponseDto, updatedRole);
  }

  async remove(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new CustomHttpException(ERROR_MESSAGES.RoleNotFound);
    }

    await this.roleRepository.softDelete(id);
  }
}
