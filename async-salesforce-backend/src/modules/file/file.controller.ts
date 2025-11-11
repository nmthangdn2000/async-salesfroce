import { Auth } from '@app/common/decorators/auth.decorator';
import { User } from '@app/common/decorators/user.decorator';
import { multerDiskOption } from '@app/common/utils/multer.util';
import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @Auth()
  @UseInterceptors(FilesInterceptor('files', undefined, multerDiskOption))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: UserEntity,
  ) {
    return this.fileService.create(files, user);
  }

  @Get(':filename')
  @ApiExcludeEndpoint()
  findOne(@Param('filename') filename: string, @Res() res: Response) {
    const file = this.fileService.findOne(filename);

    return file.pipe(res);
  }
}
