import { TGetUserProfileResponseDto } from '@app/shared/dtos/user/user.dto';

export type TLoginRequestDto = {
  email: string;
  password: string;
};

export type TLoginResponseDto = {
  accessToken: string;
  refreshToken: string;
  user: TGetUserProfileResponseDto;
};
