import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { removeDuplicates } from '@app/common/utils/array.util';
import { TJwtPayload } from '@app/core/modules/jwt-auth/jwt-auth.type';
import { TypeConfigService } from '@app/core/modules/type-config/type-config.service';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly typeConfigService: TypeConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(payload: TJwtPayload) {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
      },
      relations: {
        profile: true,
        roles: {
          permissions: true,
        },
        permissions: true,
      },
    });

    if (!user) {
      throw new CustomHttpException(ERROR_MESSAGES.UserNotFound);
    }

    user.permissions = removeDuplicates([
      ...user.permissions,
      ...user.roles.flatMap((role) =>
        role.permissions.map((permission) => permission as PermissionEntity),
      ),
    ]);

    return user;
  }

  async signToken(payload: Buffer | object, options?: JwtSignOptions) {
    return this.jwtService.signAsync(payload, {
      ...options,
      expiresIn: this.typeConfigService.get('jwt.expiresIn'),
    });
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}
