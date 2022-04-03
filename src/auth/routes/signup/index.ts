import { Router } from 'express'
import { InternalServerError } from 'http-errors'

import { UserModel, RoleModel } from '../../../common/models'
import { PublicUser } from '../../../common/schemas'

export const router = Router()

router.post('/auth/signup', async (req, res, next) => {
  try {
    const role = await RoleModel.findOne({ type: 'USER' })
    if (role === null) throw new Error("Role doesn't exists")

    const user = await new UserModel({
      ...req.body,
      role: role,
    }).populate('role')

    await user.save()

    res.status(201).json(PublicUser.parse(user))
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).json(error.errors)
    } else {
      next(new InternalServerError(error.message))
    }
  }
})

export default router
