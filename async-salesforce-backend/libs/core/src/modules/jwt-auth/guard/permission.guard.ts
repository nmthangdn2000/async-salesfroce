import { PERMISSION_KEY } from '@app/common/constants/metadata-key.constant';
import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { IS_PUBLIC_KEY } from '@app/core/modules/jwt-auth/jwt-auth.constant';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { TPermission } from '@app/shared/models';
import { TUser } from '@app/shared/models/user.model';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest<Request>();

    const bearerToken = req.headers.authorization?.trim();

    if (isPublic && !bearerToken) {
      return true;
    }

    const requiredPermissions = this.reflector.get<TPermission[]>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const user = req.user as TUser;
    const userPermissions = user.permissions || [];

    const uniqueUserPermissionCodes = [
      ...new Set(userPermissions.map((permission) => permission.code)),
    ];

    const permissionAuth = requiredPermissions.some((requiredPermission) =>
      uniqueUserPermissionCodes.includes(requiredPermission.code),
    );

    if (!permissionAuth) {
      throw new CustomHttpException(
        ERROR_MESSAGES.YouDoNotHavePermission,
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
