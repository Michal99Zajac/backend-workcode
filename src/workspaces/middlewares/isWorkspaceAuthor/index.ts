import { Request, Response, NextFunction } from 'express'
import { Forbidden } from 'http-errors'

import { prettyError } from '@common/utils'
import { WorkspaceRole } from '@workspaces/utils'

export const isWorkspaceAuthor = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.workspaceRoles)
    throw new Error(
      prettyError({ message: req.t('workspaces.middlewares.isWorkspaceAuthor.index.roles_error') })
    )

  const roles = res.locals.workspaceRoles as WorkspaceRole[]

  if (!roles.includes(WorkspaceRole.AUTHOR))
    return next(
      new Forbidden(
        prettyError({ message: req.t('workspaces.middlewares.isWorkspaceAuthor.index.forbidden') })
      )
    )

  next()
}

export default isWorkspaceAuthor
