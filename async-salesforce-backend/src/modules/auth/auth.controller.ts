import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginApiDoc } from 'src/modules/auth/docs/login.doc';
import { RegisterApiDoc } from 'src/modules/auth/docs/register.doc';
import { LoginRequestDto } from 'src/modules/auth/dto/request/login-request.dto';
import { RegisterRequestDto } from 'src/modules/auth/dto/request/register-request.dto';

import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @LoginApiDoc('Login')
  login(@Body() input: LoginRequestDto) {
    return this.authService.login(input);
  }

  @Post('register')
  @RegisterApiDoc('Register')
  register(@Body() input: RegisterRequestDto) {
    return this.authService.register(input);
  }

  @Get('oauth/callback')
  @ApiOperation({ summary: 'OAuth 2.0 callback for Salesforce authentication' })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Authorization code from Salesforce',
  })
  @ApiQuery({ name: 'sourceId', required: false, description: 'Source ID' })
  @ApiQuery({
    name: 'error',
    required: false,
    description: 'Error from OAuth provider',
  })
  @ApiResponse({ status: 200, description: 'OAuth callback result' })
  async oauthCallback(
    @Query('code') code: string,
    @Query('sourceId') sourceId: string,
    @Query('error') error: string,
  ) {
    // Handle OAuth provider errors
    if (error) {
      throw new BadRequestException(error);
    }

    // Validate required parameters
    if (!code || !sourceId) {
      throw new BadRequestException('Missing code or sourceId');
    }

    await this.authService.handleOAuthCallback(code, sourceId);

    return {
      success: true,
      message: 'Successfully connected to Salesforce',
      sourceId,
    };
  }
}
