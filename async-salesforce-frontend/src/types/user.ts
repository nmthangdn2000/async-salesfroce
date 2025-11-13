import type { PaginatedResponse } from "@/lib/api";

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dob?: string;
  gender?: string;
}

export interface User {
  id: string;
  email: string;
  profile?: UserProfile;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterUserRequest {
  page?: number;
  take?: number;
  search?: string;
  status?: string;
}

export type PaginatedUserResponse = PaginatedResponse<User>;

