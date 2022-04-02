import { Router } from 'express'

export const router = Router()

router.get('/workspace/:id/invite', (req, res) => {
  console.log(req.url)
  res.json({
    message: `invite ${req.params.id}`,
  })
})

export default router
