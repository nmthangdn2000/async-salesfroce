import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import {
  SOURCE_ENVIRONMENT,
  SOURCE_STATUS,
} from '@app/shared/models/source.model';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateSourceRequestDto } from 'src/modules/source/dto/requests/create-source.dto';
import { FilterSourceRequestDto } from 'src/modules/source/dto/requests/filter-source.dto';
import { GetPaginatedSourceResponseDto } from 'src/modules/source/dto/response/get-all-source.dto';
import { GetOneSourceResponseDto } from 'src/modules/source/dto/response/get-one-source.dto';
import { SourceEntity } from 'src/modules/source/entities/source.entity';

import { SourceRepository } from './source.repository';

@Injectable()
export class SourceService {
  constructor(private readonly sourceRepository: SourceRepository) {}

  async create(createSourceDto: CreateSourceRequestDto): Promise<SourceEntity> {
    const source = this.sourceRepository.create({
      projectId: createSourceDto.projectId,
      provider: createSourceDto.provider,
      name: createSourceDto.name,
      environment: createSourceDto.environment || SOURCE_ENVIRONMENT.PROD,
      status: createSourceDto.status || SOURCE_STATUS.ACTIVE,
    });

    return this.sourceRepository.save(source);
  }

  async findById(id: string): Promise<GetOneSourceResponseDto> {
    const source = await this.sourceRepository.findOne({ where: { id } });

    if (!source) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceNotFound);
    }

    return plainToInstance(GetOneSourceResponseDto, source);
  }

  async findAll(
    filter: FilterSourceRequestDto,
  ): Promise<GetPaginatedSourceResponseDto> {
    const query = this.sourceRepository.createQueryBuilder('source');

    if (filter.projectId) {
      query.andWhere('source.projectId = :projectId', {
        projectId: filter.projectId,
      });
    }

    if (filter.provider) {
      query.andWhere('source.provider = :provider', {
        provider: filter.provider,
      });
    }

    if (filter.environment) {
      query.andWhere('source.environment = :environment', {
        environment: filter.environment,
      });
    }

    if (filter.status) {
      query.andWhere('source.status = :status', {
        status: filter.status,
      });
    }

    if (filter.search) {
      query.andWhere('source.name ILIKE :search', {
        search: `%${filter.search}%`,
      });
    }

    const result = await this.sourceRepository.paginate(
      query,
      filter,
      GetOneSourceResponseDto,
    );

    return plainToInstance(GetPaginatedSourceResponseDto, result);
  }
}
