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
    return next(
      new UnprocessableEntity(
        prettyError({
          message: req.t('workspaces.middlewares.canSeeInvitation.index.unprocessable'),
        })
      )
    )

  const invitation = await InvitationModel.findById(invitationId)

  if (!invitation)
    return next(
      new BadRequest(
        prettyError({ message: req.t('workspaces.middlewares.canSeeInvitation.index.bad_request') })
      )
    )

  if (!invitation.guest._id.equals(user._id))
    return next(
      new Forbidden(
        prettyError({ message: req.t('workspaces.middlewares.canSeeInvitation.index.forbidden') })
      )
    )

  res.locals.invitation = invitation

  next()
}

export default canSeeInvitation
