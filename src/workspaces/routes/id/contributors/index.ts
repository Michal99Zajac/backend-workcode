import { Router } from 'express'

import { isWorkspaceAuthor, canCatchWorkspace } from '@workspaces/middlewares'

export const router = Router()

router.post(
  '/workspaces/:workspaceId/contributors',
  canCatchWorkspace,
  isWorkspaceAuthor,
  async (req, res) => {
    res.json(res.locals.workspace.public)
  }
)

export default router
