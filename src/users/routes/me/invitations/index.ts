import { Router } from 'express'

import { User } from '@users/schemas'
import { InvitationModel } from '@root/models'

export const router = Router()

router.get('/users/me/invitations', async (req, res) => {
  const user = req.user as User

  const invitations = await InvitationModel.find({ guest: user._id })
    .populate('workspace')
    .transform((invitations) => invitations.map((invitation) => invitation.public))

  res.json(invitations)
})

export default router
