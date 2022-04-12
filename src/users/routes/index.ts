import { Router } from 'express'
import passport from 'passport'

import { User } from '../models'

import userMeRouter from './me'
import userIdRouter from './id'

export const router = Router({})

router.use(
  passport.authenticate('jwt', { session: false }),
  userMeRouter,
  userIdRouter
)

router.get('/users', async (req, res) => {
  const query = req.query.query as string | undefined
  const regex = new RegExp(query, 'i')

  const users = await User.find({
    $or: [{ name: regex }, { lastname: regex }, { email: regex }],
  }).transform((users) => users.map((user) => user.public))

  res.json(users)
})

export default router
