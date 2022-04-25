import { Request, Response, NextFunction } from 'express'
import { DocumentType, mongoose } from '@typegoose/typegoose'
import { UnprocessableEntity, Forbidden } from 'http-errors'

import { setWorkspaceRoles } from '@workspaces/utils'
import { User } from '@users/models'
import { Workspace, WorkspaceModel } from '@workspaces/models'

export const workspaceGuard = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new Forbidden('user is not logged'))

  if (!req.params.workspaceId) return next(new Forbidden('id is not provided'))

  if (!mongoose.isValidObjectId(req.params.workspaceId))
    return next(new UnprocessableEntity('id is not valid'))

  // declare variables
  let workspace: DocumentType<Workspace> | null = null
  const workspaceId = req.params.workspaceId
  const user = req.user as User

  // get workspace by _id
  try {
    workspace = await WorkspaceModel.findById(workspaceId).where({
      $or: [{ author: user._id }, { contributors: user._id }],
    })

    if (!workspace)
      throw new Forbidden("user is not part of the workspace or workspace doesn't exist")
  } catch (error) {
    return next(error)
  }

  res.locals.workspace = workspace
  res.locals.workspaceRoles = setWorkspaceRoles(workspace, user._id)

  next()
}

export default workspaceGuard
