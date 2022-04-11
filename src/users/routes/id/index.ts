import { Router } from 'express'
import { NotFound } from 'http-errors'

import { User } from '@users/models'

export const router = Router()

router.get('/users/:id', async (req, res, next) => {
  const id = req.params.id

  try {
    const user = await User.findOne({ id: id }).orFail()
    res.status(200).json(user.public)
  } catch (error) {
    next(new NotFound(req.t('error.not_found')))
  }
})

export default router
