import { IS_PUBLIC_KEY } from '@app/core/modules/jwt-auth';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest<Request>();

    const bearerToken = req.headers.authorization?.trim();

    if (isPublic && !bearerToken) {
      return true;
    }

    return (await super.canActivate(context)) as boolean;
  }
}
