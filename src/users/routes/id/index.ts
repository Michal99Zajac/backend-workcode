import { Router } from 'express'
import { NotFound } from 'http-errors'

import { UserModel } from '@root/models'
import { prettyError } from '@common/utils'

export const router = Router()

router.get('/users/:_id', async (req, res, next) => {
  const _id = req.params._id

  try {
    const user = await UserModel.findOne({ _id: _id }).orFail()
    res.status(200).json(user.public)
  } catch (error) {
    next(new NotFound(prettyError({ message: req.t('error.not_found') })))
  }
})

export default router
