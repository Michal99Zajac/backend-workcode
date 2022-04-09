import { Router } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { Unauthorized, BadRequest } from 'http-errors'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import { UserClass } from '../../../users/models'
import { config } from '../../../config'

const { JWT_SECRET } = config

export const router = Router()

router.post('/auth/signin', async (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    (err, user: DocumentType<UserClass>, info) => {
      if (err || !user) return next(new Unauthorized(err.message || undefined))

      try {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET)
        res.status(200).json({
          user: user.publicWithRoles,
          token: token,
          message: info.message,
        })
      } catch (error) {
        next(new BadRequest(error.message))
      }
    }
  )(req, res, next)
})

export default router
