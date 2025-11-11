import { Auth } from '@app/common/decorators/auth.decorator';
import { UUIDParam } from '@app/common/decorators/uuid-param.decorator';
import { PERMISSION } from '@app/shared/constants/permission.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FilterRoleRequestDto } from 'src/modules/role/dto/request/get-role.dto';
import { CreateRoleRequestDto } from 'src/modules/role/dto/response/create-role.dto';
import { UpdateRoleRequestDto } from 'src/modules/role/dto/response/update-role.dto';
import { RoleService } from 'src/modules/role/role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Auth(PERMISSION.ROLE.actions.createRole)
  create(@Body() input: CreateRoleRequestDto) {
    return this.roleService.create(input);
  }

  @Get()
  @Auth(PERMISSION.ROLE.actions.getRoles)
  findAll(@Query() filter: FilterRoleRequestDto) {
    return this.roleService.findAll(filter);
  }

  @Get(':id')
  @Auth(PERMISSION.ROLE.actions.getRole)
  findOne(@UUIDParam('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Auth(PERMISSION.ROLE.actions.updateRole)
  update(@Param('id') id: string, @Body() input: UpdateRoleRequestDto) {
    return this.roleService.update(id, input);
  }

  @Delete(':id')
  @Auth(PERMISSION.ROLE.actions.deleteRole)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
