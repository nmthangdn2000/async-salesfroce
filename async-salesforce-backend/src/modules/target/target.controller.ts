import { Controller } from '@nestjs/common';

import { TargetService } from './target.service';

@Controller('targets')
export class TargetController {
  constructor(private readonly targetService: TargetService) {}
}
