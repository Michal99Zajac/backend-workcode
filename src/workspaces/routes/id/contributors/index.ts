import { Router } from 'express'

import { InvitationModel } from '@workspaces/models'
import { workspaceAuthorGuard, workspaceGuard } from '@workspaces/middlewares'

export const router = Router()

router.post(
  '/workspaces/:_id/contributors',
  workspaceGuard,
  workspaceAuthorGuard,
  async (req, res) => {
    res.json(res.locals.workspace.public)
  }
)

export default router
