import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateTargetRequestDto } from 'src/modules/target/dto/requests/create-target.dto';
import { UpdateTargetRequestDto } from 'src/modules/target/dto/requests/update-target.dto';
import { CONNECTION_TYPE } from '@app/shared/models/target.model';
import { FilterTargetRequestDto } from 'src/modules/target/dto/requests/filter-target.dto';
import { GetPaginatedTargetResponseDto } from 'src/modules/target/dto/response/get-all-target.dto';
import { GetOneTargetResponseDto } from 'src/modules/target/dto/response/get-one-target.dto';
import { TargetEntity } from 'src/modules/target/entities/target.entity';

import { TargetRepository } from './target.repository';

@Injectable()
export class TargetService {
  constructor(private readonly targetRepository: TargetRepository) {}

  async create(createTargetDto: CreateTargetRequestDto): Promise<TargetEntity> {
    const target = this.targetRepository.create({
      projectId: createTargetDto.projectId,
      sourceId: createTargetDto.sourceId,
      kind: createTargetDto.kind,
      name: createTargetDto.name,
      connectionType: (createTargetDto.connectionType || 'host') as CONNECTION_TYPE,
      host: createTargetDto.host,
      port: createTargetDto.port,
      database: createTargetDto.database,
      username: createTargetDto.username,
      schema: createTargetDto.schema,
      ssl: createTargetDto.ssl ?? false,
      sslMode: createTargetDto.sslMode,
      connectionString: createTargetDto.connectionString,
    });

    return this.targetRepository.save(target);
  }

  async update(
    id: string,
    updateTargetDto: UpdateTargetRequestDto,
  ): Promise<TargetEntity> {
    const target = await this.targetRepository.findOne({ where: { id } });

    if (!target) {
      throw new CustomHttpException(ERROR_MESSAGES.TargetNotFound);
    }

    Object.assign(target, updateTargetDto);

    return this.targetRepository.save(target);
  }

  async findById(id: string): Promise<GetOneTargetResponseDto> {
    const target = await this.targetRepository.findOne({ where: { id } });

    if (!target) {
      throw new CustomHttpException(ERROR_MESSAGES.TargetNotFound);
    }

    return plainToInstance(GetOneTargetResponseDto, target);
  }

  async findAll(
    filter: FilterTargetRequestDto,
  ): Promise<GetPaginatedTargetResponseDto> {
    const query = this.targetRepository.createQueryBuilder('target');

    if (filter.projectId) {
      query.andWhere('target.projectId = :projectId', {
        projectId: filter.projectId,
      });
    }

    if (filter.sourceId) {
      query.andWhere('target.sourceId = :sourceId', {
        sourceId: filter.sourceId,
      });
    }

    if (filter.kind) {
      query.andWhere('target.kind = :kind', {
        kind: filter.kind,
      });
    }

    if (filter.search) {
      query.andWhere('target.name ILIKE :search', {
        search: `%${filter.search}%`,
      });
    }

    const result = await this.targetRepository.paginate(
      query,
      filter,
      GetOneTargetResponseDto,
    );

    return plainToInstance(GetPaginatedTargetResponseDto, result);
  }
}
