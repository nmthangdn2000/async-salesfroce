import { JwtAuthModule } from '@app/core/modules/jwt-auth/jwt-auth.module';
import { TypeConfigModule } from '@app/core/modules/type-config/type-config.module';
import { TypeormConfigModule } from '@app/core/modules/typeorm-config';
import { I18nConfigModule } from '@app/helper';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeConfigModule,
    JwtAuthModule,
    TypeormConfigModule,
    I18nConfigModule,
  ],
})
export class CoreModule {}
