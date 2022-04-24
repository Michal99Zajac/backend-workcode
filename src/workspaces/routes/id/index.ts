import { Router } from 'express'
import { Forbidden, BadRequest } from 'http-errors'

import { WorkspaceModel, Workspace } from '@workspaces/models'
import { workspaceGuard } from '@workspaces/middlewares'
import { WorkspaceRole } from '@workspaces/utils'
import { prettyError } from '@common/utils'

export const router = Router()

router.get('/workspaces/:_id', workspaceGuard, async (req, res) => {
  res.json(res.locals.workspace.public)
})

router.patch('/workspaces/:_id', workspaceGuard, async (req, res, next) => {
  const update = req.body
  const workspace = res.locals.workspace as Workspace
  const roles = res.locals.workspaceRoles as WorkspaceRole[]

  if (!roles.includes(WorkspaceRole.AUTHOR))
    return next(new Forbidden('user is not owner of the workspace'))

  try {
    await WorkspaceModel.updateOne(
      { _id: workspace._id },
      { code: update.code, name: update.name },
      { runValidators: true }
    )
  } catch (error) {
    return next(new BadRequest(prettyError(error)))
  }

  const updatedWorkspace = await WorkspaceModel.findById(workspace._id)

  res.json(updatedWorkspace.public)
})

export default router
