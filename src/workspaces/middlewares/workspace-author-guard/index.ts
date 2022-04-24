import { Request, Response, NextFunction } from 'express'
import { Forbidden } from 'http-errors'

import { WorkspaceRole } from '@workspaces/utils'

export const workspaceAuthorGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.workspaceRoles)
    throw new Error('workspaceAuthorGuard require workspaceGuard earlier')

  const roles = res.locals.workspaceRoles as WorkspaceRole[]

  if (!roles.includes(WorkspaceRole.AUTHOR))
    return next(new Forbidden('user is not owner of the workspace'))

  next()
}

export default workspaceAuthorGuard
