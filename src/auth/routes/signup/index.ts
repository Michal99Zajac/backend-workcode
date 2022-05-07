import { Router } from 'express'
import { BadRequest } from 'http-errors'

import { UserModel, RoleModel } from '@root/models'
import { prettyError } from '@common/utils'

export const router = Router()

router.post('/auth/signup', async (req, res, next) => {
  try {
    const roles = await RoleModel.find({ value: 'USER' })

    const user = await new UserModel({
      ...req.body,
      roles: roles.map((role) => role._id),
    }).save()

    res.status(201).json(user.publicWithRoles)
  } catch (error) {
    next(new BadRequest(prettyError(error)))
  }
})

export default router
