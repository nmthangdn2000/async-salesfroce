import { Auth } from '@app/common/decorators/auth.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetPermissionResponseDto } from 'src/modules/permission/dto/get-permission.dto';

import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({
    status: 200,
    description: 'Get all permissions',
    type: GetPermissionResponseDto,
  })
  findAll() {
    return this.permissionService.findAll();
  }
}
