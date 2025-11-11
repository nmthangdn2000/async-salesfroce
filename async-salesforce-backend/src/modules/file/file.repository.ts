import { Injectable } from '@nestjs/common';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FileRepository extends Repository<FileEntity> {
  constructor(dataSource: DataSource) {
    super(FileEntity, dataSource.createEntityManager());
  }
}
