import { Router } from 'express'

import idRouter from './id'

export const router = Router()

router.use(idRouter)

export default router
