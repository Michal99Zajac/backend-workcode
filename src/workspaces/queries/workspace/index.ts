import { types } from '@typegoose/typegoose'

import { Workspace } from '@workspaces/models/Workspace'
import { QueryHelperType } from '@root/types'

export interface QueryHelpers {
  findMy: (this: any, _id: string) => QueryHelperType<Workspace[], QueryHelpers>
  publicPopulate: (
    this: any
  ) => QueryHelperType<Workspace[] | Workspace, QueryHelpers>
}

export function findMy(
  this: types.QueryHelperThis<typeof Workspace, QueryHelpers>,
  _id: string
) {
  return this.find({
    $or: [{ contributors: _id, author: _id }],
  })
}

export function publicPopulate(
  this: types.QueryHelperThis<typeof Workspace, QueryHelpers>
) {
  const select = 'id name lastname email src'
  return this.populate('author', select).populate('contributors', select)
}
