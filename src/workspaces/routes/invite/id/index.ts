import { Router } from 'express'

import { canSeeInvitation } from '@workspaces/middlewares'
import { Invitation } from '@workspaces/models'

import acceptRouter from './accept'
import declineRouter from './decline'

export const router = Router()

router.use(acceptRouter, declineRouter)

router.get('/workspaces/invite/:invitationId', canSeeInvitation, (req, res) => {
  const invitation = res.locals.invitation as Invitation

  res.json(invitation.public)
})

export default router
