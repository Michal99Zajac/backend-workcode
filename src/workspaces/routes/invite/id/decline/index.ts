import { Router } from 'express'
import { DocumentType } from '@typegoose/typegoose'

import { canSeeInvitation } from '@workspaces/middlewares'
import { Invitation, InvitationModel } from '@workspaces/models'

export const router = Router()

router.post('/workspaces/invite/:invitationId/decline', canSeeInvitation, async (req, res) => {
  const invitation = res.locals.invitation as DocumentType<Invitation>

  await InvitationModel.deleteOne({ _id: invitation._id })

  res.json({ message: 'Invitation has been declined' })
})

export default router
