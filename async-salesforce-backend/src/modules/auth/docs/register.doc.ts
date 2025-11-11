import { BaseResponseDto } from '@app/common/base/response.dto.base';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const RegisterApiDoc = (operation: string) => {
  return applyDecorators(
    ApiOperation({ summary: operation }),
    ApiResponse({ status: 200, description: 'Success', type: BaseResponseDto }),
  );
};
