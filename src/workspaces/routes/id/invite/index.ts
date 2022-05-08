/* eslint-disable prettier/prettier */
import { Router } from 'express'
import { BadRequest } from 'http-errors'

import { InvitationModel, UserModel } from '@root/models'
import { Workspace } from '@workspaces/schemas'
import { User } from '@users/schemas'
import { isWorkspaceAuthor, canCatchWorkspace } from '@workspaces/middlewares'
import { prettyError } from '@common/utils'

export const router = Router()

router.get(
  '/workspaces/:workspaceId/invite',
  canCatchWorkspace,
  isWorkspaceAuthor,
  async (req, res, next) => {
    const workspace = res.locals.workspace as Workspace
    const user = req.user as User
    const query = {
      limit: isNaN(+req.query.limit) ? 0 : +req.query.limit,
      page: isNaN(+req.query.page) ? 0 : +req.query.page,
      query: req.query.query,
    }

    try {
      const userQuery = UserModel.find({
        $not: {
          $eq: user._id,
        },
      }).getQuery()

      const count = await UserModel.find(userQuery).countDocuments()
      const users = await UserModel.find(userQuery)
        .skip(query.page * query.limit)
        .limit(query.limit)
        .sort('name')
        .transform((users) => users.map((user) => user.public))

      res.json({
        users: users,
        navigation: {
          first: 0,
          next: query.page + 1,
          previous: query.page - 1,
          last: count % query.limit,
          count: count,
        },
      })
    } catch (error) {
      next(new BadRequest(prettyError(error)))
    }
  }
)

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
