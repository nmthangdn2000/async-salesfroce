import { ICreateProjectRequestDto } from '@app/shared/dtos/project/project.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectRequestDto implements ICreateProjectRequestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
