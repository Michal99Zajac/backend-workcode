import { Router } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { UnprocessableEntity } from 'http-errors'
import bcrypt from 'bcrypt'
import validator from 'validator'

import { config } from '../../../config'
import { UserClass, User } from '../../models/User'
import { prettyError } from '../../../common/utils'

const { SALT_ROUNDS } = config

export const router = Router()

router.get('/users/me', (req, res) => {
  res.status(200).json(req.user)
})

router.patch('/users/me', async (req, res, next) => {
  const body = req.body
  const user = req.user as DocumentType<UserClass>

  let newPassword = undefined
  if (body.password) {
    if (!validator.isStrongPassword(body.password)) {
      return next(
        new UnprocessableEntity({ password: 'password is too weak' } as any)
      )
    }

    newPassword = await bcrypt.hash(body.password, SALT_ROUNDS)
  }

  try {
    const updatedUser: DocumentType<UserClass> = await User.updateOne(
      { id: user.id },
      {
        name: body.name,
        lastname: body.lastname,
        email: body.email,
        password: newPassword,
      },
      {
        runValidators: true,
      }
    ).then(() => {
      return User.findOne({ id: user.id })
    })
    res.status(200).json(updatedUser.public)
  } catch (error) {
    next(new UnprocessableEntity(prettyError(error)))
  }
})

export default router
