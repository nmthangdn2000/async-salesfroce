import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { AUTH_TYPE } from '@app/shared/models/source.model';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateSourceSettingRequestDto } from 'src/modules/source-setting/dto/requests/create-source-setting.dto';
import { FilterSourceSettingRequestDto } from 'src/modules/source-setting/dto/requests/filter-source-setting.dto';
import { GetPaginatedSourceSettingResponseDto } from 'src/modules/source-setting/dto/response/get-all-source-setting.dto';
import { GetOneSourceSettingResponseDto } from 'src/modules/source-setting/dto/response/get-one-source-setting.dto';
import { SourceSettingEntity } from 'src/modules/source-setting/entities/source-setting.entity';

import { SourceSettingRepository } from './source-setting.repository';

@Injectable()
export class SourceSettingService {
  constructor(
    private readonly sourceSettingRepository: SourceSettingRepository,
  ) {}

  async create(
    createSourceSettingDto: CreateSourceSettingRequestDto,
  ): Promise<SourceSettingEntity> {
    // Check if setting already exists for this source
    const existingSetting = await this.sourceSettingRepository.findOne({
      where: { sourceId: createSourceSettingDto.sourceId },
    });

    if (existingSetting) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceSettingAlreadyExists);
    }

    const sourceSetting = this.sourceSettingRepository.create({
      sourceId: createSourceSettingDto.sourceId,
      instanceUrl: createSourceSettingDto.instanceUrl,
      authType: createSourceSettingDto.authType || AUTH_TYPE.OAUTH2,
      scopes: createSourceSettingDto.scopes,
      clientId: createSourceSettingDto.clientId,
      clientSecret: createSourceSettingDto.clientSecret,
      refreshToken: createSourceSettingDto.refreshToken,
    });

    return this.sourceSettingRepository.save(sourceSetting);
  }

  async findById(id: string): Promise<GetOneSourceSettingResponseDto> {
    const sourceSetting = await this.sourceSettingRepository.findOne({
      where: { id },
      relations: ['source'],
    });

    if (!sourceSetting) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceSettingNotFound);
    }

    return plainToInstance(GetOneSourceSettingResponseDto, sourceSetting);
  }

  async findBySourceId(
    sourceId: string,
  ): Promise<GetOneSourceSettingResponseDto> {
    const sourceSetting = await this.sourceSettingRepository.findOne({
      where: { sourceId },
      relations: ['source'],
    });

    if (!sourceSetting) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceSettingNotFound);
    }

    return plainToInstance(GetOneSourceSettingResponseDto, sourceSetting);
  }

  async findAll(
    filter: FilterSourceSettingRequestDto,
  ): Promise<GetPaginatedSourceSettingResponseDto> {
    const query =
      this.sourceSettingRepository.createQueryBuilder('sourceSetting');

    if (filter.sourceId) {
      query.andWhere('sourceSetting.sourceId = :sourceId', {
        sourceId: filter.sourceId,
      });
    }

    if (filter.authType) {
      query.andWhere('sourceSetting.authType = :authType', {
        authType: filter.authType,
      });
    }

    const result = await this.sourceSettingRepository.paginate(
      query,
      filter,
      GetOneSourceSettingResponseDto,
    );

    return plainToInstance(GetPaginatedSourceSettingResponseDto, result);
  }

  async update(
    id: string,
    input: Partial<CreateSourceSettingRequestDto>,
  ): Promise<SourceSettingEntity> {
    const sourceSetting = await this.sourceSettingRepository.findOne({
      where: { id },
    });

    if (!sourceSetting) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceSettingNotFound);
    }

    // Don't overwrite clientSecret if it's empty string or undefined
    // Only update if a new value is provided (non-empty string)
    const { clientSecret, ...restInput } = input;
    const finalInput: Partial<CreateSourceSettingRequestDto> = {
      ...restInput,
    };

    // Only update clientSecret if a new non-empty value is provided
    if (clientSecret !== undefined && clientSecret !== '') {
      finalInput.clientSecret = clientSecret;
    }

    const dataUpdate = this.sourceSettingRepository.create({
      ...sourceSetting,
      ...finalInput,
    });

    return this.sourceSettingRepository.save(dataUpdate);
  }

  async remove(id: string): Promise<void> {
    const sourceSetting = await this.sourceSettingRepository.findOne({
      where: { id },
    });

    if (!sourceSetting) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceSettingNotFound);
    }

    await this.sourceSettingRepository.remove(sourceSetting);
  }
}
