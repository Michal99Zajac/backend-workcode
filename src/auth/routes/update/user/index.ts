import { Router } from 'express'
import passport from 'passport'
import { BadRequest } from 'http-errors'

import { UserModel } from '../../../../common/models/User'
import { User } from '../../../../common/schemas/User'

import { RequestBody, Response } from './schema'

export const router = Router()

router.patch(
  '/auth/update/user',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const payloadUser = User.parse(req.user)
      const requestBody = RequestBody.parse(req.body)

      await UserModel.updateOne(
        { _id: payloadUser._id },
        {
          name: requestBody.name || payloadUser.name,
          lastname: requestBody.lastname || payloadUser.lastname,
          email: requestBody.email || payloadUser.email,
        }
      )
      const newUser = await UserModel.findOne({
        _id: payloadUser._id,
      })

      res.json(Response.parse(newUser))
    } catch (error) {
      next(new BadRequest(error))
    }
  }
)

export default router
