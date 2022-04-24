import { Router } from 'express'

import { invitationAccessGuard } from '@workspaces/middlewares'
import { Invitation } from '@workspaces/models'

import acceptRouter from './accept'

export const router = Router()

router.use(acceptRouter)

router.get('/workspaces/invite/:invitationId', invitationAccessGuard, (req, res) => {
  const invitation = res.locals.invitation as Invitation

  res.json(invitation.public)
})

export default router
