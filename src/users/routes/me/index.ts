import { Router } from 'express'
import { UnprocessableEntity, BadRequest } from 'http-errors'

import { UserModel, User } from '@users/models/User'
import { prettyError } from '@common/utils'
import { encryptPassword } from '@users/utils'

export const router = Router()

router.get('/users/me', (req, res) => {
  const user = req.user as User

  res.status(200).json(user.public)
})

router.patch('/users/me', async (req, res, next) => {
  const body = req.body
  const user = req.user as User

  try {
    const newPassword = encryptPassword(body.password)

    const updatedUser = await UserModel.updateOne(
      { _id: user._id },
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
      return UserModel.findOne({ _id: user._id })
    })
    res.status(200).json(updatedUser.public)
  } catch (error) {
    next(new UnprocessableEntity(prettyError(error)))
  }
})

router.delete('/users/me', async (req, res, next) => {
  const _id = (req.user as User)._id
  const password = req.body.password

  const user = await UserModel.findOne({ _id: _id })

  const isCorrect = await user.checkPassword(password)
  if (!isCorrect)
    return next(new BadRequest({ password: 'password is incorrect' } as any))

  try {
    await UserModel.deleteOne({ _id: user._id })
    res.status(200).json({
      message: 'user has been deleted',
    })
  } catch (error) {
    next(new BadRequest(prettyError(error)))
  }
})

export default router
