import { Router } from 'express'
import { BadRequest } from 'http-errors'

import { WorkspaceModel, Workspace } from '@workspaces/models'
import { canCatchWorkspace, isWorkspaceAuthor } from '@workspaces/middlewares'
import { prettyError } from '@common/utils'

import contributorsRouter from './contributors'
import inviteRouter from './invite'
import leaveRouter from './leave'

export const router = Router()

router.use(contributorsRouter, inviteRouter, leaveRouter)

router.get('/workspaces/:workspaceId', canCatchWorkspace, async (req, res) => {
  res.json(res.locals.workspace.public)
})

router.patch(
  '/workspaces/:workspaceId',
  canCatchWorkspace,
  isWorkspaceAuthor,
  async (req, res, next) => {
    const update = req.body
    const workspace = res.locals.workspace as Workspace

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
  }
)

router.delete(
  '/workspaces/:workspaceId',
  canCatchWorkspace,
  isWorkspaceAuthor,
  async (req, res) => {
    const workspace = res.locals.workspace as Workspace

    await WorkspaceModel.deleteOne({ _id: workspace._id })

    res.json({
      message: `Workspace '${workspace.name}' has been deleted`,
    })
  }
)

export default router
