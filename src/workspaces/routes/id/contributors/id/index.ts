import { Router } from 'express'
import { BadRequest } from 'http-errors'

import { WorkspaceModel } from '@root/models'
import { Workspace } from '@workspaces/schemas'
import { canCatchWorkspace, isWorkspaceAuthor } from '@workspaces/middlewares'
import { prettyError } from '@root/common/utils'

export const router = Router()

router.delete(
  '/workspaces/:workspaceId/contributors/:userId',
  canCatchWorkspace,
  isWorkspaceAuthor,
  async (req, res, next) => {
    const workspace = res.locals.workspace as Workspace
    const userId = req.params.userId

    if (
      !workspace.contributors
        .map((contributor) => contributor._id)
        .some((id) => id.toString() === userId)
    ) {
      return next(new BadRequest(prettyError({ message: 'User is not part of the workspace' })))
    }

    try {
      await WorkspaceModel.updateOne({ _id: workspace._id }, { $pull: { contributors: userId } })
      res.json({ message: 'Update successfully' })
    } catch (error) {
      next(new BadRequest(prettyError({ message: 'Update faild' })))
    }
  }
)

export default router
