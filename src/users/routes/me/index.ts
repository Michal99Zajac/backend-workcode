import { Router } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { UnprocessableEntity, BadRequest } from 'http-errors'

import { UserClass, User } from '@users/models/User'
import { prettyError } from '@common/utils'
import { encryptPassword } from '@users/utils'

export const router = Router()

const PATH = '/users/me'

router.get(PATH, (req, res) => {
  res.status(200).json(req.user)
})

router.patch(PATH, async (req, res, next) => {
  const body = req.body
  const user = req.user as DocumentType<UserClass>

  try {
    const newPassword = encryptPassword(body.password)

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

router.delete(PATH, async (req, res, next) => {
  const id = (req.user as any).id
  const password = req.body.password

  const user = await User.findOne({ id: id })

  const isCorrect = await user.checkPassword(password)
  if (!isCorrect)
    return next(new BadRequest({ password: 'password is incorrect' } as any))

  try {
    await User.deleteOne({ id: user.id })
    res.status(200).json({
      message: 'user has been deleted',
    })
  } catch (error) {
    next(new BadRequest(prettyError(error)))
  }
})

export default router
