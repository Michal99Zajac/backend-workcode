import { Router } from 'express'
import { InternalServerError } from 'http-errors'

import usersMeBasicRouter from './basic'

export const router = Router()

router.use(usersMeBasicRouter)

router.get('/users/me', (req, res, next) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    next(new InternalServerError(error))
  }
})

export default router
