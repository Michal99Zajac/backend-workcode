import { DocumentType } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'

import { Workspace } from '@workspaces/models'

export const setWorkspaceRoles = (workspace: DocumentType<Workspace>, userId: ObjectId) => {
  const roles = []

  if (workspace.author._id.equals(userId)) roles.push('AUTHOR')
  if (workspace.contributors.some((contributor) => contributor._id.equals(userId)))
    roles.push('CONTRIBUTOR')

  return roles
}

export default setWorkspaceRoles
