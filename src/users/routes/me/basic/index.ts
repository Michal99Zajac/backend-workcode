import { Router } from 'express'
import { BadRequest } from 'http-errors'

import { UserModel, User } from '../../../models'

import { Body, Response } from './schema'

export const router = Router()

router.patch('/users/me/basic', async (req, res, next) => {
  try {
    const user = User.parse(req.user)
    const body = req.body

    await UserModel.updateOne(
      { _id: user._id },
      {
        name: body.name,
        lastname: body.lastname,
        email: body.email,
      },
      {
        runValidators: true,
      }
    )
    const updatedUser = await UserModel.findById(user._id)
    res.json(Response.parse(updatedUser))
  } catch (error) {
    next(new BadRequest(error))
  }
})

export default router
