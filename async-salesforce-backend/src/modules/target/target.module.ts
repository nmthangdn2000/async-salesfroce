import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TargetEntity } from './entities/target.entity';
import { TargetConnectionEntity } from './entities/target-connection.entity';
import { TargetController } from './target.controller';
import { TargetRepository } from './target.repository';
import { TargetService } from './target.service';

@Module({
  imports: [TypeOrmModule.forFeature([TargetEntity, TargetConnectionEntity])],
  controllers: [TargetController],
  providers: [TargetService, TargetRepository],
  exports: [TargetRepository, TargetService],
})
export class TargetModule {}
