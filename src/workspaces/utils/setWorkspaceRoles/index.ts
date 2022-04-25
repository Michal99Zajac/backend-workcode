import { DocumentType } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'

import { WorkspaceRole } from '@workspaces/utils'
import { Workspace } from '@workspaces/models'

export const setWorkspaceRoles = (workspace: DocumentType<Workspace>, userId: ObjectId) => {
  const roles: WorkspaceRole[] = []

  if (workspace.author._id.equals(userId)) roles.push(WorkspaceRole.AUTHOR)
  if (workspace.contributors.some((contributor) => contributor._id.equals(userId)))
    roles.push(WorkspaceRole.CONTRIBUTE)

  return roles
}

export default setWorkspaceRoles
