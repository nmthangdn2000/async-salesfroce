import { IUpdateRoleRequestDto } from '@app/shared/dtos';
import { PartialType } from '@nestjs/swagger';
import { CreateRoleRequestDto } from 'src/modules/role/dto/response/create-role.dto';

export class UpdateRoleRequestDto
  extends PartialType(CreateRoleRequestDto)
  implements IUpdateRoleRequestDto {}
