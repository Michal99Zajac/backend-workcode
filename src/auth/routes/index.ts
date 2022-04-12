import { Router } from 'express'

import { router as forgotRouter } from './forgot-password'
import { router as signinRouter } from './signin'
import { router as signupRouter } from './signup'

export const router = Router()

router.use(forgotRouter, signinRouter, signupRouter)

export default router
