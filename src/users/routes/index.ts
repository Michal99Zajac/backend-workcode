import { Router } from 'express'
import passport from 'passport'
import { BadRequest } from 'http-errors'

import { UserModel } from '../models'

import userMeRouter from './me'
import userIdRouter from './id'
import { Response } from './schema'

export const router = Router({})

router.use(
  passport.authenticate('jwt', { session: false }),
  userMeRouter,
  userIdRouter
)

router.get('/users', async (req, res, next) => {
  try {
    const users = await UserModel.find({})
    res.json(Response.parse(users))
  } catch (error) {
    next(new BadRequest(error))
  }
})

export default router
