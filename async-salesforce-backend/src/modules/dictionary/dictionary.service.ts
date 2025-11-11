import { Injectable } from '@nestjs/common';

import { DictionaryRepository } from './dictionary.repository';

@Injectable()
export class DictionaryService {
  constructor(private readonly dictionaryRepository: DictionaryRepository) {}
}
