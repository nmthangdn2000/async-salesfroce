import { customPlainToInstance } from '@app/common/utils/instance-transform.util';
import { PERMISSION } from '@app/shared/constants/permission.constant';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetPermissionResponseDto } from 'src/modules/permission/dto/get-permission.dto';
import { PermissionRepository } from 'src/modules/permission/permission.repository';
import { ROLE_EVENT_EMITTER } from 'src/modules/role/constants/event-emitter.constant';

@Injectable()
export class PermissionService implements OnModuleInit {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    private readonly permissionRepository: PermissionRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    void this.initPermission();
  }

  async initPermission() {
    try {
      const permissions = Object.values(PERMISSION).flatMap((permission) => {
        return Object.values(permission.actions).map((action) => ({
          code: action.code,
          key: action.key,
          name: action.name,
          description: action.description,
          module: action.module,
        }));
      });

      await this.permissionRepository.save(permissions);
      this.eventEmitter.emit(ROLE_EVENT_EMITTER.ROLE_INIT, permissions);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAll() {
    const permissions = await this.permissionRepository.find();

    return customPlainToInstance(GetPermissionResponseDto, permissions);
  }
}
