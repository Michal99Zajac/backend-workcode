import { Router } from 'express'

import { workspaceAuthorGuard, workspaceGuard } from '@workspaces/middlewares'

export const router = Router()

router.post(
  '/workspaces/:workspaceId/contributors',
  workspaceGuard,
  workspaceAuthorGuard,
  async (req, res) => {
    res.json(res.locals.workspace.public)
  }
)

export default router
