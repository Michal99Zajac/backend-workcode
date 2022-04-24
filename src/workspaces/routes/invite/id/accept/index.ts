import { Router } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { BadRequest } from 'http-errors'

import { Invitation, InvitationModel, WorkspaceModel } from '@workspaces/models'
import { invitationAccessGuard } from '@workspaces/middlewares'
import { prettyError } from '@common/utils'

export const router = Router()

router.post(
  '/workspaces/invite/:invitationId/accept',
  invitationAccessGuard,
  async (req, res, next) => {
    const invitation = res.locals.invitation as DocumentType<Invitation>

    const workspace = await WorkspaceModel.findById(invitation.workspace._id)

    // start transaction
    const workspaceSession = await WorkspaceModel.startSession()
    workspaceSession.startTransaction()
    const invitationSession = await InvitationModel.startSession()
    invitationSession.startTransaction()

    try {
      await InvitationModel.deleteOne({ _id: invitation._id })

      await WorkspaceModel.updateOne(
        { _id: workspace._id },
        { $push: { contributors: invitation.guest._id } }
      )

      // commit transaction
      workspaceSession.commitTransaction()
      invitationSession.commitTransaction()
    } catch (error) {
      // abort transaction
      await workspaceSession.abortTransaction()
      await invitationSession.abortTransaction()
      return next(new BadRequest(prettyError(error)))
    }

    // end sessions
    workspaceSession.endSession()
    invitationSession.endSession()

    const updatedWorkspace = await WorkspaceModel.findById(workspace._id)

    res.json(updatedWorkspace.public)
  }
)

export default router
