import { Controller } from '@nestjs/common';

import { MappingService } from './mapping.service';

@Controller('mappings')
export class MappingController {
  constructor(private readonly mappingService: MappingService) {}
}
