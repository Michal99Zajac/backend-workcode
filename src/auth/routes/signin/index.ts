import { Router } from 'express'

export const router = Router()

router.get('/auth/signin', async (req, res, next) => {
  res.json({
    token: 'token',
  })
})

export default router
