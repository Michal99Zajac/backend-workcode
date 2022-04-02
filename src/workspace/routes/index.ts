import { Router } from 'express'

import { router as idRouter } from './id'

export const router = Router()

router.use(idRouter)

export default router
