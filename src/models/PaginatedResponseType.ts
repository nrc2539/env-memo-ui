export interface PaginationMetaType {
  total: number;
  page: number;
  limitPerPage: number;
  totalPages: number;
}

export interface PaginatedResponseType<T> {
  data: T[];
  meta: PaginationMetaType;
}
