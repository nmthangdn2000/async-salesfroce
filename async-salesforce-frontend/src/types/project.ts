export interface Project {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectRequest {
  name: string
}

export interface FilterProjectRequest {
  page?: number
  take?: number
  search?: string
}

export interface PaginatedProjectResponse {
  items: Project[]
  meta: {
    page: number
    take: number
    totalItems: number
    totalPages: number
    itemCount: number
  }
}

