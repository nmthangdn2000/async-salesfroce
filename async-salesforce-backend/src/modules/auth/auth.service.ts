import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { removeDuplicates } from '@app/common/utils/array.util';
import { compare, hash } from '@app/common/utils/bcrypt.util';
import { customPlainToInstance } from '@app/common/utils/instance-transform.util';
import { JwtAuthService, TJwtPayload } from '@app/core/modules/jwt-auth';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LoginResponseDto } from 'src/modules/auth/dto/response/login-response.dto';
import { UserRepository } from 'src/modules/user/user.repository';

import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterRequestDto } from './dto/request/register-request.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async login(input: LoginRequestDto) {
    const user = await this.userRepository.findOne({
      where: { email: input.email },
      relations: {
        profile: true,
        roles: {
          permissions: true,
        },
        permissions: true,
      },
    });

    if (!user) {
      throw new CustomHttpException(ERROR_MESSAGES.EmailOrPasswordIncorrect);
    }

    const isPasswordValid = await compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new CustomHttpException(ERROR_MESSAGES.EmailOrPasswordIncorrect);
    }

    const payload: TJwtPayload = {
      sub: user.id,
    };

    const accessToken = await this.jwtAuthService.signToken(payload);

    return customPlainToInstance(LoginResponseDto, {
      user: {
        ...user,
        permissions: removeDuplicates([
          ...user.permissions,
          ...user.roles.flatMap((role) =>
            role.permissions.map((permission) => permission.code),
          ),
        ]),
      },
      accessToken,
    });
  }

  async register(input: RegisterRequestDto) {
    const isUserExist = await this.userRepository.findOne({
      where: { email: input.email },
    });

    if (isUserExist) {
      throw new CustomHttpException(ERROR_MESSAGES.EmailAlreadyExists);
    }

    const hashedPassword = await hash(input.password);

    const uuid = randomUUID();

    await this.userRepository.save({
      id: uuid,
      email: input.email,
      password: hashedPassword,
      profile: {
        userId: uuid,
        firstName: input.firstName,
        lastName: input.lastName,
      },
    });
  }
}
