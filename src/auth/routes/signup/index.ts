import { Router } from 'express'
import { BadRequest } from 'http-errors'

import { User, Role } from '../../../users/models'
import { prettyError } from '../../../common/utils'

export const router = Router()

router.post('/auth/signup', async (req, res, next) => {
  try {
    const roles = await Role.find(/*{ value: 'USER' }*/)

    const user = await User.create({
      ...req.body,
      roles: ['6252b6892f961e0464109a91', '6252b6902f961e0464109a92'],
    })
    const created = await (await user.save()).populate('roles')
    res.status(201).json(created.publicWithRoles)
  } catch (error) {
    next(new BadRequest(prettyError(error)))
  }
})

export default router
