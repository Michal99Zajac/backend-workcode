import { Router } from 'express'
import { BadRequest } from 'http-errors'

import { User, Role } from '../../../users/models'
import { prettyError } from '../../../common/utils'

export const router = Router()

router.post('/auth/signup', async (req, res, next) => {
  try {
    const role = await Role.findOne({ value: 'USER' })

    const user = new User({
      ...req.body,
      roles: [role._id],
    })
    const created = await (await user.save()).populate('roles')

    res.status(201).json(created.publicWithRoles)
  } catch (error) {
    next(new BadRequest(prettyError(error)))
  }
})

export default router
