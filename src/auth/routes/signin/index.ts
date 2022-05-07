import { Router } from 'express'
import { Unauthorized } from 'http-errors'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import { User } from '@users/schemas'
import { config } from '@config'

const { JWT_SECRET } = config

export const router = Router()

router.post('/auth/signin', async (req, res, next) => {
  passport.authenticate('local', { session: false }, (error, user: User, info) => {
    if (error) return next(new Unauthorized(error))

    const token = jwt.sign({ _id: user._id }, JWT_SECRET)
    res.status(200).json({
      user: user.publicWithRoles,
      token: token,
      message: info.message,
    })
  })(req, res, next)
})

export default router
