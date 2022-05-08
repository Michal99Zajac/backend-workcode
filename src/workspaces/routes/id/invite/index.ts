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
    const pagination = {
      limit: isNaN(+req.query.limit) ? 0 : +req.query.limit,
      page: isNaN(+req.query.page) ? 0 : +req.query.page,
    }
    const query = req.query.query as string

    const matchedUsers = await UserModel.matchedFullname(query)
    try {
      const users = await UserModel.findPagination(
        {
          $and: [
            {
              _id: {
                $not: {
                  $eq: user._id,
                },
              },
            },
            {
              _id: {
                $nin: workspace.contributors,
              },
            },
            query
              ? {
                  $or: [
                    {
                      _id: {
                        $in: matchedUsers,
                      },
                    },
                    {
                      email: query,
                    },
                  ],
                }
              : {},
          ],
        },
        pagination
      )

      res.json({
        ...users,
        users: users.users.map((user) => user.public),
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
