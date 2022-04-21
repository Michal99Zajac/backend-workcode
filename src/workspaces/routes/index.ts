import { Router } from 'express'
import passport from 'passport'
import { UnprocessableEntity } from 'http-errors'

import { User } from '@users/models/User'
import { WorkspaceModel } from '@workspaces/models/Workspace'
import { prettyError } from '@root/common/utils'
import { findWorkspaces } from '@workspaces/helpers'

export const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

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
