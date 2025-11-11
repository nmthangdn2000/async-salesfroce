import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { customPlainToInstance } from '@app/common/utils/instance-transform.util';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PermissionRepository } from 'src/modules/permission/permission.repository';
import { RoleRepository } from 'src/modules/role/role.repository';
import { CreateUserRequestDto } from 'src/modules/user/dto/request/create-user.dto';
import { FilterUserRequestDto } from 'src/modules/user/dto/request/get-user.dto';
import { UpdateUserRequestDto } from 'src/modules/user/dto/request/update-user.dto';
import {
  GetPaginatedUserProfileResponseDto,
  GetUserProfileResponseDto,
} from 'src/modules/user/dto/response/get-user.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRepository } from 'src/modules/user/user.repository';
import { In } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async create(input: CreateUserRequestDto) {
    const userInstance = plainToInstance(UserEntity, input);

    if (input.roles && input.roles.length > 0) {
      const roles = await this.roleRepository.find({
        where: { id: In(input.roles) },
        relations: {
          permissions: true,
        },
      });

      userInstance.roles = roles;
    }

    if (input.permissions && input.permissions.length > 0) {
      const permissions = await this.permissionRepository.find({
        where: { code: In(input.permissions) },
      });

      userInstance.permissions = permissions;
    }

    await this.userRepository.save(userInstance);

    return customPlainToInstance(GetUserProfileResponseDto, userInstance);
  }

  async findAll(filterUserRequestDto: FilterUserRequestDto) {
    const { search, dob, gender, status } = filterUserRequestDto;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.permissions', 'userPermissions');

    if (search) {
      queryBuilder.where(
        `user.email LIKE :search 
         OR user.profile.phone LIKE :search 
         OR CONCAT(user.profile.firstName, ' ', user.profile.lastName) LIKE :search`,
        { search: `%${search}%` },
      );
    }

    if (dob) {
      queryBuilder.andWhere('user.profile.dob = :dob', { dob: new Date(dob) });
    }

    if (gender) {
      queryBuilder.andWhere('user.profile.gender = :gender', { gender });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    const result = await this.userRepository.paginate(
      queryBuilder,
      filterUserRequestDto,
      GetUserProfileResponseDto,
      false,
    );

    return customPlainToInstance(GetPaginatedUserProfileResponseDto, result);
  }

  findMe(user: any) {
    return customPlainToInstance(GetUserProfileResponseDto, user);
  }

  async findOne(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .leftJoinAndSelect('user.permissions', 'userPermissions')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new CustomHttpException(ERROR_MESSAGES.UserNotFound);
    }

    return customPlainToInstance(GetUserProfileResponseDto, user);
  }

  async update(id: string, input: UpdateUserRequestDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new CustomHttpException(ERROR_MESSAGES.UserNotFound);
    }

    const userInstance = plainToInstance(UserEntity, {
      ...user,
      ...input,
    });

    if (input.roles && input.roles.length > 0) {
      const roles = await this.roleRepository.find({
        where: { id: In(input.roles) },
      });

      userInstance.roles = roles;
    }

    if (input.permissions && input.permissions.length > 0) {
      const permissions = await this.permissionRepository.find({
        where: { code: In(input.permissions) },
      });

      userInstance.permissions = permissions;
    }

    await this.userRepository.save(userInstance);

    return customPlainToInstance(GetUserProfileResponseDto, userInstance);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new CustomHttpException(ERROR_MESSAGES.UserNotFound);
    }

    await this.userRepository.softDelete(id);
  }
}
