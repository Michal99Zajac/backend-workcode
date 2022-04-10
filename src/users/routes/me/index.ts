import { Router } from 'express'

import usersMeBasicRouter from './basic'

export const router = Router()

router.use(usersMeBasicRouter)

router.get('/users/me', (req, res) => {
  res.status(200).json(req.user)
})

export default router
