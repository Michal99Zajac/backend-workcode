import { Router } from 'express'
import { BadRequest } from 'http-errors'

import { User } from '../../../models'

export const router = Router()

router.patch('/users/me/basic', async (req, res, next) => {
  try {
    const body = req.body
    const user = req.user as User

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
