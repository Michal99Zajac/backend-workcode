import { Router } from 'express'
import passport from 'passport'
import { UnprocessableEntity } from 'http-errors'

import { User } from '@users/models/User'
import { WorkspaceModel } from '@workspaces/models/Workspace'
import { prettyError } from '@root/common/utils'

export const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.get('/workspaces', async (req, res) => {
  const user = req.user as User
  const workspaces = await WorkspaceModel.find({
    $or: [{ contributors: user._id }, { author: user._id }],
  }).transform((workspaceArray) =>
    workspaceArray.map((workspace) => workspace.public)
  )

  res.json(workspaces)
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
