import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from 'src/modules/user/user.repository';

import { TypeConfigService } from '../type-config/type-config.service';
import { JwtAuthService } from './jwt-auth.service';
import { JwtStrategy } from './strategy/jwt-auth.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [TypeConfigService],
      useFactory: (configService: TypeConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [JwtAuthService, JwtStrategy, UserRepository],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
