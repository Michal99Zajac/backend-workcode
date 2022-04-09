import { Router } from 'express'

import { User } from '../../models'

export const router = Router()

router.get('/users/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const user = await User.findOne({ _id: id })
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
})

export default router
