import { Router } from 'express'

export const router = Router()

router.get('/auth/signin', (req, res) => {
  res.json({
    message: req.t('example.x'),
  })
})

export default router
