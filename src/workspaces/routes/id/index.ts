import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { UnprocessableEntity, Forbidden } from 'http-errors'
import { DocumentType } from '@typegoose/typegoose'

import { WorkspaceModel, Workspace } from '@workspaces/models'
import { User } from '@users/models'

export const router = Router()

router.get('/workspaces/:_id', async (req, res, next) => {
  const workspaceId = req.params._id
  const user = req.user as User

  let workspace: DocumentType<Workspace> | null = null
  try {
    workspace = await WorkspaceModel.findById(new ObjectId(workspaceId))
  } catch (error) {
    return next(
      new UnprocessableEntity({
        message: "id doesn't have allowed form",
      } as any)
    )
  }

  if (!workspace) return res.json(workspace)

  const isForbbiden =
    !workspace.author._id.equals(user._id) &&
    !workspace.contributors.some((contributor) =>
      contributor._id.equals(user._id)
    )
  if (isForbbiden)
    return next(
      new Forbidden({ message: 'user is not part of the workspace' } as any)
    )

  res.json(workspace.public)
})

export default router
