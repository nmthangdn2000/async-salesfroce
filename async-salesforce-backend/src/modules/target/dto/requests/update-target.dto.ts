import { PartialType } from '@nestjs/swagger';
import { CreateTargetRequestDto } from './create-target.dto';

export class UpdateTargetRequestDto extends PartialType(CreateTargetRequestDto) {}
