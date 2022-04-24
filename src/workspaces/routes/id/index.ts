import { Router } from 'express'

import { workspaceGuard } from '@workspaces/middlewares'

export const router = Router()

router.get('/workspaces/:_id', workspaceGuard, async (req, res) => {
  res.json(res.locals.workspace.public)
})

export default router
