import { Injectable } from '@nestjs/common';

import { TargetRepository } from './target.repository';

@Injectable()
export class TargetService {
  constructor(private readonly targetRepository: TargetRepository) {}
}
