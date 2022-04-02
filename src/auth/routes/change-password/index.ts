import { Router } from 'express'

export const router = Router()

router.get('/auth/change-password/:id', (req, res) => {
  res.json({
    message: `Hello ${req.params.id}`,
  })
})

export default router
