import { Request, Response, NextFunction } from 'express'
import { Forbidden, UnprocessableEntity, BadRequest } from 'http-errors'
import mongoose from 'mongoose'

import { prettyError } from '@common/utils'
import { InvitationModel } from '@root/models'
import { User } from '@users/schemas'

export const canSeeInvitation = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const invitationId = req.params.invitationId

  if (!mongoose.isValidObjectId(invitationId))
    return next(new UnprocessableEntity(prettyError({ message: 'invitation id is not valid' })))

  const invitation = await InvitationModel.findById(invitationId)

  if (!invitation) return next(new BadRequest(prettyError({ message: "invitation doesn't exist" })))

  if (!invitation.guest._id.equals(user._id))
    return next(new Forbidden(prettyError({ message: 'user is not guest' })))

  res.locals.invitation = invitation

  next()
}

export default canSeeInvitation
