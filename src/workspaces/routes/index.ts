import { Router } from 'express'
import passport from 'passport'
import { UnprocessableEntity } from 'http-errors'

import { WorkspaceModel, Workspace } from '@workspaces/models/Workspace'
import { prettyError } from '@root/common/utils'

export const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.get('/workspaces', async (req, res) => {
  const user = req.user as any
  const workspaces = (await WorkspaceModel.find()
    .findMy(user._id)
    .publicPopulate()) as Workspace[]

  res.json(workspaces.map((workspace) => workspace.public))
})

router.post('/workspaces', async (req, res, next) => {
  const user = req.user as any
  const newWorkspace = new WorkspaceModel({
    ...req.body,
    author: user._id,
    contributors: [user._id],
  })

  try {
    const workspace = await newWorkspace
      .save()
      .then((result) => result.populate('author contributors'))

    res.status(201).json(workspace.public)
  } catch (error) {
    return next(new UnprocessableEntity(prettyError(error)))
  }
})

export default router
