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
      return next(
        new BadRequest(
          prettyError({
            message: req.t('workspaces.routes.id.contributors.id.index.delete.no_part'),
          })
        )
      )
    }

    try {
      await WorkspaceModel.updateOne({ _id: workspace._id }, { $pull: { contributors: userId } })
      res.json({ message: req.t('workspaces.routes.id.contributors.id.index.delete.success') })
    } catch (error) {
      next(
        new BadRequest(
          prettyError({ message: req.t('workspaces.routes.id.contributors.id.index.delete.fail') })
        )
      )
    }
  }
)

export default router
