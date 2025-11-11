import { TPermission } from '@app/shared/models/permission.model';

export type TGetPermissionResponseDto = Omit<
  TPermission,
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedBy'
  | 'roles'
  | 'users'
>;
