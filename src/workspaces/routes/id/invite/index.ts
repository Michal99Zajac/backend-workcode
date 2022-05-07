import { Router } from 'express'
import { BadRequest } from 'http-errors'

import { InvitationModel, UserModel } from '@root/models'
import { Workspace } from '@workspaces/schemas'
import { User } from '@users/schemas'
import { isWorkspaceAuthor, canCatchWorkspace } from '@workspaces/middlewares'
import { prettyError } from '@common/utils'

export const router = Router()

router.post(
  '/workspaces/:workspaceId/invite',
  canCatchWorkspace,
  isWorkspaceAuthor,
  async (req, res, next) => {
    const guestId = req.body._id as string
    const workspace = res.locals.workspace as Workspace
    const user = req.user as User

    const guest = await UserModel.findById(guestId)

    if (!guest) return next(new BadRequest("user doesn't exist"))

    if (user._id.equals(guest._id)) return next(new BadRequest("Author can't invite self"))

    try {
      const invitation = await new InvitationModel({
        workspace: workspace._id,
        guest: guest._id,
      }).save()

      res.status(201).json(invitation.public)
    } catch (error) {
      next(new BadRequest(prettyError(error)))
    }
  }
)

export default router
