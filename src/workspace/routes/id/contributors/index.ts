import { Router } from 'express'

export const router = Router()

router.get('/workspace/:id/contributors', (req, res) => {
  res.json({
    message: 'contributors',
  })
})

export default router
