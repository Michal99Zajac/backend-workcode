import { Router } from 'express'
import passport from 'passport'
import { UnprocessableEntity } from 'http-errors'

import { WorkspaceModel } from '@root/models'
import { User } from '@users/schemas/User'
import { prettyError } from '@common/utils'
import { findWorkspaces } from '@workspaces/helpers'

import idRouter from './id'
import inviteRouter from './invite'

export const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.use(idRouter, inviteRouter)

router.get('/workspaces', async (req, res) => {
  const user = req.user as User

  const workspaces = await findWorkspaces(req.query, user)

  res.status(200).json(workspaces)
})

router.post('/workspaces', async (req, res, next) => {
  const user = req.user as User
  const newWorkspace = new WorkspaceModel({
    ...req.body,
    author: user._id,
    contributors: [],
  })

  try {
    const workspace = await newWorkspace.save()

    res.status(201).json(workspace.public)
  } catch (error) {
    return next(new UnprocessableEntity(prettyError(error)))
  }
})

export default router
