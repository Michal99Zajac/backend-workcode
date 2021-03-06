import { Request, Response, NextFunction } from 'express'
import { DocumentType, mongoose } from '@typegoose/typegoose'
import { UnprocessableEntity, Forbidden } from 'http-errors'

import { prettyError } from '@common/utils'
import { WorkspaceModel } from '@root/models'
import { setWorkspaceRoles } from '@workspaces/utils'
import { User } from '@users/schemas'
import { Workspace } from '@root/workspaces/schemas'

export const canCatchWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user)
    return next(
      new Forbidden(
        prettyError({
          message: req.t('workspaces.middlewares.canCatchWorkspace.index.forbidden_logged'),
        })
      )
    )

  if (!req.params.workspaceId)
    return next(
      new Forbidden(
        prettyError({
          message: req.t('workspaces.middlewares.canCatchWorkspace.index.forbidden_id'),
        })
      )
    )

  if (!mongoose.isValidObjectId(req.params.workspaceId))
    return next(
      new UnprocessableEntity(
        prettyError({
          message: req.t('workspaces.middlewares.canCatchWorkspace.index.unprocessable'),
        })
      )
    )

  // declare variables
  let workspace: DocumentType<Workspace> | null = null
  const workspaceId = req.params.workspaceId
  const user = req.user as User

  // get workspace by _id
  try {
    workspace = await WorkspaceModel.findOne({
      _id: workspaceId,
      $or: [{ author: user._id }, { contributors: user._id }],
    })

    if (!workspace)
      throw new Forbidden(
        prettyError({
          message: req.t('workspaces.middlewares.canCatchWorkspace.index.forbidden_no_workspace'),
        })
      )
  } catch (error) {
    return next(error)
  }

  res.locals.workspace = workspace
  res.locals.workspaceRoles = setWorkspaceRoles(workspace, user._id)

  next()
}

export default canCatchWorkspace
