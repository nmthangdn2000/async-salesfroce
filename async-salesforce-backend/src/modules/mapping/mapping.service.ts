import { Injectable } from '@nestjs/common';

import { MappingRepository } from './mapping.repository';

@Injectable()
export class MappingService {
  constructor(private readonly mappingRepository: MappingRepository) {}
}
