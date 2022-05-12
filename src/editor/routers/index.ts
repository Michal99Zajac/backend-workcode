import { Router } from 'express'
import passport from 'passport'

import { router as idRouter } from './id'

export const router = Router({})

router.use(passport.authenticate('jwt', { session: false }), idRouter)

export default router
