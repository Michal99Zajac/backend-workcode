import { Router } from 'express'
import { Unauthorized, BadRequest } from 'http-errors'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import { PublicUser } from '../../../users/parsers'
import { config } from '../../../config'

const { JWT_SECRET } = config

export const router = Router()

router.post('/auth/signin', async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) return next(new Unauthorized(err.message || undefined))

    try {
      const publicUser = PublicUser.parse(user)
      const token = jwt.sign({ _id: publicUser._id }, JWT_SECRET)
      res.status(200).json({
        user: publicUser,
        token: token,
        message: info.message,
      })
    } catch (error) {
      next(new BadRequest(error.message))
    }
  })(req, res, next)
})

export default router
