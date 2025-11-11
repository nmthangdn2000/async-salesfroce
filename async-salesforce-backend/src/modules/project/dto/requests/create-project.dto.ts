import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectRequestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
