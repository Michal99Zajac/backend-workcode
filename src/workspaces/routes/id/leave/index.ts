import { Router } from 'express'
import { InternalServerError } from 'http-errors'

import { User } from '@users/models'
import { Workspace, WorkspaceModel } from '@workspaces/models'
import { isWorkspaceContributor, canCatchWorkspace } from '@workspaces/middlewares'
import { prettyError } from '@common/utils'

export const router = Router()

router.post(
  '/workspaces/:workspaceId/leave',
  canCatchWorkspace,
  isWorkspaceContributor,
  async (req, res, next) => {
    const workspace = res.locals.workspace as Workspace
    const user = req.user as User

    try {
      await WorkspaceModel.updateOne({ _id: workspace._id }, { $pull: { contributors: user._id } })

      res.json({ message: 'User leaved from workspace successfully' })
    } catch (error) {
      next(new InternalServerError(prettyError(error)))
    }
  }
)

export default router
