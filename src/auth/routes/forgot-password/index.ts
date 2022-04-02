import { Router } from 'express'

export const router = Router()

router.get('/auth/forgot-password', (req, res) => {
  res.json({
    message: 'forgot-password',
  })
})

export default router
