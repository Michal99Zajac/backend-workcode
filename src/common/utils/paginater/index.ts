import { Pagination } from '@common/types'

interface Params {
  limit: number
  page: number
  count: number
}

export const paginater = (params: Params): Pagination => {
  const { limit, page, count } = params

  const first = 0
  const last = count ? Math.ceil(count / limit) - 1 : 0
  const next = page + 1 > last ? last : page + 1
  const previous = page - 1 < 0 ? first : page - 1

  return {
    next,
    last,
    first,
    previous,
    count,
  }
}

export default paginater
