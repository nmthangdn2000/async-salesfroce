import { BaseResponseDto } from '@app/common/base/response.dto.base';
import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { LoginResponseDto } from 'src/modules/auth/dto/response/login-response.dto';

export function LoginApiDoc(operation: string) {
  return applyDecorators(
    ApiOperation({ summary: operation }),
    ApiExtraModels(BaseResponseDto, LoginResponseDto),
    ApiOkResponse({
      description: 'Success',
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(LoginResponseDto) },
            },
          },
        ],
      },
    }),
  );
}
