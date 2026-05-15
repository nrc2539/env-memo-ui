export interface PaginationMeta {
  total: number;
  page: number;
  limitPerPage: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
