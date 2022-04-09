import { Router } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { BadRequest } from 'http-errors'

import { User, UserClass } from '../../../models'

export const router = Router()

router.patch('/users/me/basic', async (req, res, next) => {
  try {
    const body = req.body
    const user = req.user as DocumentType<UserClass>

    await User.updateOne(
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
    const updatedUser = await User.findById(user._id)
    res.json(updatedUser)
  } catch (error) {
    next(new BadRequest(error))
  }
})

export default router