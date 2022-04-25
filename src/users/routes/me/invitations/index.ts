import { Router } from 'express'

import { User } from '@users/models'
import { InvitationModel } from '@workspaces/models'

export const router = Router()

router.get('/users/me/invitations', async (req, res) => {
  const user = req.user as User

  const invitations = await InvitationModel.find({ guest: user._id })
    .populate('workspace')
    .transform((invitations) => invitations.map((invitation) => invitation.public))

  res.json(invitations)
})

export default router
