import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { FileRepository } from 'src/modules/file/file.repository';

import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [FileService, FileRepository],
})
export class FileModule {}
