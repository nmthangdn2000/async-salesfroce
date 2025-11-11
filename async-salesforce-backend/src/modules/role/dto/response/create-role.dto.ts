import { ICreateRoleRequestDto } from '@app/shared/dtos/role/role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRoleRequestDto implements ICreateRoleRequestDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'admin',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'The description of the role',
    example: 'admin',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'The permissions of the role',
    example: [1, 2, 3],
  })
  @IsNumber({}, { each: true })
  permissions!: number[];
}
