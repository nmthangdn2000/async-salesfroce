import { TypeConfigService } from '@app/core/modules/type-config';
import { Injectable } from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { FileRepository } from 'src/modules/file/file.repository';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly configService: TypeConfigService,
  ) {}

  async create(files: Express.Multer.File[], user: UserEntity) {
    const file = await this.fileRepository.save(
      files.map((file) => ({
        userId: user.id,
        name: file.originalname,
        path: file.path,
        size: file.size,
        type: file.mimetype,
        url: `${this.configService.get('app.backendUrl')}/files/${file.filename}`,
      })),
    );

    return file;
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(filename: string): ReadStream {
    const file = createReadStream(
      join(process.cwd(), 'public', 'uploads', filename),
    );

    return file;
  }
}
