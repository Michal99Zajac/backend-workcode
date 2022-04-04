import { Router } from 'express'
import passport from 'passport'

import { router as updateUserRouter } from './user'

export const router = Router()

router.use(passport.authenticate('jwt', { session: false }), updateUserRouter)

export default router
