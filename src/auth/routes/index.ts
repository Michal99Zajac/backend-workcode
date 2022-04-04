import { Router } from 'express'

import { router as changeRouter } from './change-password'
import { router as forgotRouter } from './forgot-password'
import { router as signinRouter } from './signin'
import { router as signupRouter } from './signup'
import { router as updateRouter } from './update'

export const router = Router()

router.use(changeRouter, forgotRouter, signinRouter, signupRouter, updateRouter)

export default router
