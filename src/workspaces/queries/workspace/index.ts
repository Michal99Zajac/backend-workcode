import { types } from '@typegoose/typegoose'

import { Workspace } from '@workspaces/models/Workspace'

export interface QueryHelpers {
  findMy: (this: any, _id: string) => Promise<types.DocumentType<Workspace[]>>
}

export function findMy(
  this: types.QueryHelperThis<typeof Workspace, QueryHelpers>,
  _id: string
) {
  return this.find({
    $or: [{ contributors: _id, author: _id }],
  })
}
