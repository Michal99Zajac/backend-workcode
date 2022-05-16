import { Router } from 'express'

import { Workspace } from '@workspaces/schemas'
import { canCatchWorkspace } from '@workspaces/middlewares'

import { router as idRouter } from './id'

export const router = Router()

router.use(idRouter)

router.get('/workspaces/:workspaceId/contributors', canCatchWorkspace, async (req, res) => {
  const workspace = res.locals.workspace as Workspace

  res.json(workspace.public.contributors)
})

export default router
