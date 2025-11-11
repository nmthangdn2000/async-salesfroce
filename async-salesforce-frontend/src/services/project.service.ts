import { request } from "@/lib/api";
import type {
  CreateProjectRequest,
  FilterProjectRequest,
  PaginatedProjectResponse,
  Project,
} from "@/types/project";

/**
 * Project API Service
 * Tất cả các API calls liên quan đến Project
 */
export const projectApi = {
  /**
   * Lấy danh sách tất cả projects với pagination và filter
   */
  getAll: async (
    filter?: FilterProjectRequest
  ): Promise<PaginatedProjectResponse> => {
    return request<PaginatedProjectResponse>("/projects", {
      method: "GET",
      params: filter,
    });
  },

  /**
   * Lấy thông tin project theo slug
   */
  getBySlug: async (slug: string): Promise<Project> => {
    return request<Project>(`/projects/${slug}`, {
      method: "GET",
    });
  },

  /**
   * Tạo project mới
   */
  create: async (data: CreateProjectRequest): Promise<Project> => {
    return request<Project>("/projects", {
      method: "POST",
      body: data,
    });
  },
};
