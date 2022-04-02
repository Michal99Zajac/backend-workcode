import { Router } from 'express'

import { router as contributorsRouter } from './contributors'
import { router as inviteRouters } from './invite'

export const router = Router()

router.get('/workspace/:id', (req, res) => {
  res.json({
    message: 'update',
  })
})

router.use(contributorsRouter, inviteRouters)

export default router
