import { Router } from 'express'
import { DocumentType } from '@typegoose/typegoose'

import { InvitationModel } from '@root/models'
import { canSeeInvitation } from '@workspaces/middlewares'
import { Invitation } from '@workspaces/schemas'

export const router = Router()

router.post('/workspaces/invite/:invitationId/decline', canSeeInvitation, async (req, res) => {
  const invitation = res.locals.invitation as DocumentType<Invitation>

  await InvitationModel.deleteOne({ _id: invitation._id })

  res.json({ message: 'Invitation has been declined' })
})

export default router
