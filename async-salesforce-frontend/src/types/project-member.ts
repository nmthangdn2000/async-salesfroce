import type { PaginatedResponse } from "@/lib/api";

export enum ProjectMemberRole {
  OWNER = "owner",
  ADMIN = "admin",
  EDITOR = "editor",
  VIEWER = "viewer",
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
}

export interface ProjectMemberUser {
  id: string;
  email: string;
  profile?: UserProfile;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectMemberRole;
  user?: ProjectMemberUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectMemberRequest {
  projectId: string;
  userId: string;
  role: ProjectMemberRole;
}

export interface FilterProjectMemberRequest {
  page?: number;
  take?: number;
  projectId?: string;
  userId?: string;
  role?: ProjectMemberRole;
}

export type PaginatedProjectMemberResponse = PaginatedResponse<ProjectMember>;

