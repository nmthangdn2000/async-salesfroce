import { IUpdateUserRequestDto } from '@app/shared/dtos/user/user.dto';
import { PartialType } from '@nestjs/swagger';
import { CreateUserRequestDto } from 'src/modules/user/dto/request/create-user.dto';

export class UpdateUserRequestDto
  extends PartialType(CreateUserRequestDto)
  implements IUpdateUserRequestDto {}
