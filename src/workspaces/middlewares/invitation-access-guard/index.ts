import { Request, Response, NextFunction } from 'express'
import { Forbidden, UnprocessableEntity, BadRequest } from 'http-errors'
import mongoose from 'mongoose'

import { InvitationModel } from '@workspaces/models'
import { User } from '@users/models'

export const invitationAccessGuard = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const invitationId = req.params.invitationId

  if (!mongoose.isValidObjectId(invitationId))
    return next(new UnprocessableEntity('invitation id is not valid'))

  const invitation = await InvitationModel.findById(invitationId)

  if (!invitation) return next(new BadRequest("invitation doesn't exist"))

  if (!invitation.guest._id.equals(user._id)) return next(new Forbidden('user is not guest'))

  res.locals.invitation = invitation

  next()
}

export default invitationAccessGuard
