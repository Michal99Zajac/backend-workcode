import { Router } from 'express'
import { InternalServerError } from 'http-errors'

import { User } from '../../models'

import usersMeBasicRouter from './basic'

export const router = Router()

router.use(usersMeBasicRouter)

router.get('/users/me', (req, res, next) => {
  const user = req.user as User
  try {
    res.status(200).json(user)
  } catch (error) {
    next(new InternalServerError(error))
  }
})

export default router
