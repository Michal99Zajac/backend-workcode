export interface PaginationQuery {
  limit: number
  page: number
}

export interface Pagination {
  first: number
  last: number
  next: number
  previous: number
  count: number
}
