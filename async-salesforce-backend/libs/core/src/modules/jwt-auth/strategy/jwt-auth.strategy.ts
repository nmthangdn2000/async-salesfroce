import { JwtAuthService } from '@app/core/modules/jwt-auth/jwt-auth.service';
import { TJwtPayload } from '@app/core/modules/jwt-auth/jwt-auth.type';
import { TypeConfigService } from '@app/core/modules/type-config/type-config.service';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    readonly typeConfigService: TypeConfigService,
    private readonly jwtAuthService: JwtAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: typeConfigService.get('jwt.secret'),
    });
  }

  async validate(payload: TJwtPayload) {
    try {
      const user = await this.jwtAuthService.validateUser(payload);

      return { ...user };
    } catch (error) {
      this.logger.error(error);

      throw new UnauthorizedException(ERROR_MESSAGES.UserNotFound);
    }
  }
}
