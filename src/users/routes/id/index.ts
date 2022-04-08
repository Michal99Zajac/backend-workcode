import { Router } from 'express'

import { UserModel } from '../../models'

import { Response } from './schema'

export const router = Router()

router.get('/users/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const user = await UserModel.findOne({ _id: id })
    res.status(200).json(Response.parse(user))
  } catch (error) {
    next(error)
  }
})

export default router
