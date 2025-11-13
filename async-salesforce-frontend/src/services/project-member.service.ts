import { request } from "@/lib/api";
import type {
  CreateProjectMemberRequest,
  FilterProjectMemberRequest,
  PaginatedProjectMemberResponse,
  ProjectMember,
} from "@/types/project-member";

/**
 * Project Member API Service
 * Tất cả các API calls liên quan đến Project Member
 */
export const projectMemberApi = {
  /**
   * Lấy danh sách tất cả project members với pagination và filter
   */
  getAll: async (
    filter?: FilterProjectMemberRequest
  ): Promise<PaginatedProjectMemberResponse> => {
    return request<PaginatedProjectMemberResponse>("/project-members", {
      method: "GET",
      params: filter,
    });
  },

  /**
   * Lấy thông tin project member theo id
   */
  getById: async (id: string): Promise<ProjectMember> => {
    return request<ProjectMember>(`/project-members/${id}`, {
      method: "GET",
    });
  },

  /**
   * Tạo project member mới
   */
  create: async (
    data: CreateProjectMemberRequest
  ): Promise<ProjectMember> => {
    return request<ProjectMember>("/project-members", {
      method: "POST",
      body: data,
    });
  },

  /**
   * Xóa project member
   */
  delete: async (id: string): Promise<void> => {
    return request<void>(`/project-members/${id}`, {
      method: "DELETE",
    });
  },
};

