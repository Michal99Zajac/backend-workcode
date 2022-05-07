import { Router } from 'express'

import { Workspace } from '@workspaces/schemas'
import { canCatchWorkspace } from '@workspaces/middlewares'

export const router = Router()

router.get('/workspaces/:workspaceId/contributors', canCatchWorkspace, async (req, res) => {
  const workspace = res.locals.workspace as Workspace

  res.json(workspace.public.contributors)
})

export default router
