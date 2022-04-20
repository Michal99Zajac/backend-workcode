import { Router } from 'express'
import passport from 'passport'
import { UnprocessableEntity } from 'http-errors'

import { WorkspaceModel } from '@workspaces/models/Workspace'
import { prettyError } from '@root/common/utils'

export const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.get('/workspaces', async (req, res) => {
  const select = '_id name lastname email src'
  const user = req.user as any
  const response = await WorkspaceModel.find({
    $or: [{ contributors: user._id, author: user._id }],
  })
    .populate('author', select)
    .populate('contributors', select)
    .then((workspaces) => workspaces.map((workspace) => workspace.public))

  res.json(response)
})

router.post('/workspaces', async (req, res, next) => {
  const select = '_id name lastname email src'
  const user = req.user as any
  const newWorkspace = new WorkspaceModel({
    ...req.body,
    author: user._id,
    contributors: [user._id],
  })

  try {
    const workspace = await (await newWorkspace.save())
      .populate('author', select)
      .then((result) => result.populate('contributors', select))

    res.status(201).json(workspace.public)
  } catch (error) {
    return next(new UnprocessableEntity(prettyError(error)))
  }
})

export default router
