import { TProfile } from '@app/shared/models/profile.model';

export type TGetProfileResponseDto = Omit<
  TProfile,
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedBy'
  | 'id'
>;

export type ICreateProfileRequestDto = Pick<
  TProfile,
  'firstName' | 'lastName' | 'dob' | 'gender'
>;
