import { request } from "@/lib/api";
import type {
  FilterUserRequest,
  PaginatedUserResponse,
  User,
} from "@/types/user";

/**
 * User API Service
 * Tất cả các API calls liên quan đến User
 */
export const userApi = {
  /**
   * Lấy danh sách tất cả users với pagination và filter
   */
  getAll: async (filter?: FilterUserRequest): Promise<PaginatedUserResponse> => {
    return request<PaginatedUserResponse>("/user", {
      method: "GET",
      params: filter,
    });
  },

  /**
   * Lấy thông tin user theo id
   */
  getById: async (id: string): Promise<User> => {
    return request<User>(`/user/${id}`, {
      method: "GET",
    });
  },
};

