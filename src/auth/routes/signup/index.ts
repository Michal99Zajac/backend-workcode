import { Router } from 'express'
import { BadRequest } from 'http-errors'

import { User, Role } from '../../../users/models'
import { prettyError } from '../../../common/utils'

export const router = Router()

router.post('/auth/signup', async (req, res, next) => {
  try {
    const roles = await Role.find({ value: 'USER' })

    const user = await new User({
      ...req.body,
      roles: roles.map((role) => role._id),
    })
      .save()
      .then((result) => {
        return result.populate('roles')
      })

    res.status(201).json(user.publicWithRoles)
  } catch (error) {
    next(new BadRequest(prettyError(error)))
  }
})

export default router
