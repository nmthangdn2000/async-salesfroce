import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
}
