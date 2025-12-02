const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export interface PaginationMeta {
  page: number;
  take: number;
  totalItems: number;
  totalPages: number;
  itemCount: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  message: string | string[];
  errorMessage?: string;
  errorCode?: number | string;
  statusCode?: number;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    // Prefer errorMessage over message for better user-friendly messages
    const errorMessage = data.errorMessage || 
      (typeof data.message === "string"
        ? data.message
        : data.message?.join(", ") || "An error occurred");
    throw new Error(errorMessage);
  }

  // Backend wraps response in { statusCode, data, message }
  // Unwrap the data field if it exists
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    "statusCode" in data
  ) {
    return data.data;
  }
  return data;
}

/**
 * Hàm request chung cho tất cả các API calls
 */
export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, params, headers = {} } = options;

  const url = new URL(`${API_BASE_URL}${endpoint}`);

  // Thêm query params cho GET request
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Chuẩn bị headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Chuẩn bị body
  let requestBody: string | undefined;
  if (body) {
    if (typeof body === "string") {
      requestBody = body;
    } else {
      requestBody = JSON.stringify(body);
    }
  }

  const response = await fetch(url.toString(), {
    method,
    headers: defaultHeaders,
    body: requestBody,
  });

  return handleResponse<T>(response);
}

// Các hàm helper cho từng method
export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> {
  return request<T>(endpoint, { method: "GET", params });
}

export async function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  return request<T>(endpoint, { method: "POST", body: data });
}

export async function apiPut<T>(endpoint: string, data?: any): Promise<T> {
  return request<T>(endpoint, { method: "PUT", body: data });
}

export async function apiPatch<T>(endpoint: string, data?: any): Promise<T> {
  return request<T>(endpoint, { method: "PATCH", body: data });
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: "DELETE" });
}
