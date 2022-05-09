import { Request, Response, NextFunction } from 'express'
import { Forbidden } from 'http-errors'

import { prettyError } from '@common/utils'
import { WorkspaceRole } from '@workspaces/utils'

/**
 * Function establish if user can leave from workspace
 *
 * important: middleware has to run after canCatchWorkspace middleware
 */
export const isWorkspaceContributor = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.workspaceRoles)
    throw new Error(prettyError({ message: 'canLeave require canCatchWorkspace earlier exec' }))

  const roles = res.locals.workspaceRoles as WorkspaceRole[]

  if (!roles.includes(WorkspaceRole.CONTRIBUTE))
    return next(new Forbidden(prettyError({ message: 'user is owner of the workspace' })))

  next()
}

export default isWorkspaceContributor
