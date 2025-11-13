import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { removeDuplicates } from '@app/common/utils/array.util';
import { compare, hash } from '@app/common/utils/bcrypt.util';
import { customPlainToInstance } from '@app/common/utils/instance-transform.util';
import { JwtAuthService, TJwtPayload } from '@app/core/modules/jwt-auth';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LoginResponseDto } from 'src/modules/auth/dto/response/login-response.dto';
import { SourceSettingRepository } from 'src/modules/source-setting/source-setting.repository';
import { SourceSettingService } from 'src/modules/source-setting/source-setting.service';
import { UserRepository } from 'src/modules/user/user.repository';

import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterRequestDto } from './dto/request/register-request.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtAuthService: JwtAuthService,
    private readonly sourceSettingService: SourceSettingService,
    private readonly sourceSettingRepository: SourceSettingRepository,
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

  async getOAuthAuthorizationUrl(sourceId: string): Promise<string> {
    if (!sourceId) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceSettingNotFound, 400);
    }

    const sourceSetting =
      await this.sourceSettingService.findBySourceId(sourceId);

    if (!sourceSetting) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceSettingNotFound);
    }

    if (!sourceSetting.instanceUrl || !sourceSetting.clientId) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceSettingNotFound, 400);
    }

    const instanceUrl = sourceSetting.instanceUrl;

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const callbackUrl = `${backendUrl}/api/auth/oauth/callback?sourceId=${sourceId}`;

    const scopes =
      sourceSetting.scopes?.join(' ') || 'api refresh_token offline_access';

    // Build authorization URL
    const clientId = sourceSetting.clientId as string;
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: callbackUrl,
      scope: scopes,
    });

    return `${instanceUrl}/services/oauth2/authorize?${params.toString()}`;
  }

  async handleOAuthCallback(code: string, sourceId: string): Promise<void> {
    const sourceSetting =
      await this.sourceSettingService.findBySourceId(sourceId);

    if (!sourceSetting) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceSettingNotFound);
    }

    if (!sourceSetting.clientId) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceSettingNotFound, 400);
    }

    // Get client secret from repository (not exposed in response DTO)
    const sourceSettingEntity = await this.sourceSettingRepository.findOne({
      where: { sourceId },
    });

    if (!sourceSettingEntity || !sourceSettingEntity.clientSecret) {
      throw new CustomHttpException(ERROR_MESSAGES.SourceSettingNotFound, 400);
    }

    // Determine token endpoint based on instance URL
    const instanceUrl = sourceSetting.instanceUrl;
    const isSandbox =
      instanceUrl.includes('test') || instanceUrl.includes('sandbox');
    const tokenEndpoint = isSandbox
      ? 'https://test.salesforce.com/services/oauth2/token'
      : 'https://login.salesforce.com/services/oauth2/token';

    // Get callback URL
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const callbackUrl = `${backendUrl}/api/auth/oauth/callback?sourceId=${sourceId}`;

    // Exchange authorization code for access token and refresh token
    // At this point, we've already validated clientId and clientSecret exist
    const clientId = sourceSetting.clientId as string;
    const clientSecret = sourceSettingEntity.clientSecret;

    const tokenRequestParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
      code: code,
    });

    try {
      const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenRequestParams.toString(),
      });

      if (!tokenResponse.ok) {
        throw new CustomHttpException(ERROR_MESSAGES.OAuthCallbackFailed, 400);
      }

      const tokenData = (await tokenResponse.json()) as {
        refresh_token: string;
      };

      // Update source setting with refresh token
      await this.sourceSettingService.update(sourceSettingEntity.id, {
        refreshToken: tokenData.refresh_token,
      });
    } catch (error: unknown) {
      if (error instanceof CustomHttpException) {
        throw error;
      }
      throw new CustomHttpException(ERROR_MESSAGES.OAuthCallbackFailed, 500);
    }
  }
}
