import { BaseResponseDto } from '@app/common/base/response.dto.base';
import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  GetPaginatedUserProfileResponseDto,
  GetUserProfileResponseDto,
} from 'src/modules/user/dto/response/get-user.dto';

export function GetPaginatedUserApiDoc(operation: string) {
  return applyDecorators(
    ApiOperation({ summary: operation }),
    ApiExtraModels(BaseResponseDto, GetPaginatedUserProfileResponseDto),
    ApiOkResponse({
      description: 'Success',
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(GetPaginatedUserProfileResponseDto),
              },
            },
          },
        ],
      },
    }),
  );
}

export function GetUserApiDoc(operation: string) {
  return applyDecorators(
    ApiOperation({ summary: operation }),
    ApiExtraModels(BaseResponseDto, GetUserProfileResponseDto),
    ApiOkResponse({
      description: 'Success',
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(GetUserProfileResponseDto) },
            },
          },
        ],
      },
    }),
  );
}
