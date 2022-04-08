import { Router } from 'express'
import { BadRequest } from 'http-errors'
import bcrypt from 'bcrypt'

import { UserModel, RoleModel } from '../../../users/models'
import { PublicUser } from '../../../users/parsers'
import config from '../../../config'

const { SALT_ROUNDS } = config

export const router = Router()

router.post('/auth/signup', async (req, res, next) => {
  try {
    const role = await RoleModel.findOne({ type: 'USER' })
    if (role === null) throw new Error(req.t('errors.role_not_exists'))

    if (!req.body.password)
      throw new Error(req.t('errors.password_not_provided'))

    const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS)

    const user = await new UserModel({
      ...req.body,
      password: hash,
      role: role,
    }).populate('role')

    await user.save()

    res.status(201).json(PublicUser.parse(user))
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).json(error.errors)
    } else {
      next(new BadRequest(error.message))
    }
  }
})

export default router
