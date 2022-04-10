import { Router } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { UnprocessableEntity } from 'http-errors'

import { User, UserClass } from '../../../models'
import { prettyError } from '../../../../common/utils'

export const router = Router()

router.patch<DocumentType<UserClass>>(
  '/users/me/basic',
  async (req, res, next) => {
    const body = req.body
    const user = req.user as DocumentType<UserClass>

    try {
      const updatedUser: DocumentType<UserClass> = await User.updateOne(
        { id: user.id },
        {
          name: body.name,
          lastname: body.lastname,
          email: body.email,
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
  }
)

export default router
