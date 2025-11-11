import { Auth } from '@app/common/decorators/auth.decorator';
import { User } from '@app/common/decorators/user.decorator';
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
import {
  GetPaginatedUserApiDoc,
  GetUserApiDoc,
} from 'src/modules/user/docs/get-user.doc';
import { CreateUserRequestDto } from 'src/modules/user/dto/request/create-user.dto';
import { FilterUserRequestDto } from 'src/modules/user/dto/request/get-user.dto';
import { UpdateUserRequestDto } from 'src/modules/user/dto/request/update-user.dto';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() input: CreateUserRequestDto) {
    return this.userService.create(input);
  }

  @Get()
  @Auth(PERMISSION.USER.actions.getUsers)
  @GetPaginatedUserApiDoc('Get users')
  findAll(@Query() filterUserRequestDto: FilterUserRequestDto) {
    return this.userService.findAll(filterUserRequestDto);
  }

  @Get('me')
  @Auth(PERMISSION.USER.actions.getUser)
  @GetUserApiDoc('Get me')
  findMe(@User() user: any) {
    return this.userService.findMe(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateUserRequestDto) {
    return this.userService.update(id, input);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
