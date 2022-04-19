import { types } from '@typegoose/typegoose'

import { Workspace } from '@workspaces/models'

export type WorkcodeError = {
  key: string
  message: string
}

export type WorkcodeErrors = WorkcodeError[]

export type QueryHelperType<T, QH> = Promise<types.DocumentType<T>> &
  types.QueryHelperThis<typeof Workspace, QH>
