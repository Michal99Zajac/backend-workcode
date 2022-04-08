import { Router } from 'express'
import { InternalServerError } from 'http-errors'

import { User } from '../../models'
import { PublicUser } from '../../parsers'

import usersMeBasicRouter from './basic'

export const router = Router()

router.use(usersMeBasicRouter)

router.get('/users/me', (req, res, next) => {
  try {
    const user = User.parse(req.user)

    res.status(200).json(PublicUser.parse(user))
  } catch (error) {
    next(new InternalServerError(error))
  }
})

export default router
