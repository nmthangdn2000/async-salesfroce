import { JwtAuthModule } from '@app/core/modules/jwt-auth';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceSettingModule } from 'src/modules/source-setting/source-setting.module';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRepository } from 'src/modules/user/user.repository';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
  imports: [
    JwtAuthModule,
    TypeOrmModule.forFeature([UserEntity]),
    SourceSettingModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
