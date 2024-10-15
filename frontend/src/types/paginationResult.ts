export interface PaginatedResult<T> {
  results: T[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
