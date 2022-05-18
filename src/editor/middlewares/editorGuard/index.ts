import { Request, Response, NextFunction } from 'express'
import { NotFound, BadRequest, Forbidden } from 'http-errors'

import { EditorModel } from '@root/models'
import { prettyError } from '@common/utils'
import { User } from '@users/schemas'
import { Workspace } from '@workspaces/schemas'

export const editorGuard = async (req: Request, res: Response, next: NextFunction) => {
  const workspaceId = req.params.workspaceId
  const user = req.user as User

  try {
    const editor = await EditorModel.findOne({ workspace: workspaceId })

    if (!editor)
      return next(
        new NotFound(
          prettyError({ message: req.t('editor.middlewares.editorGuard.index.not_found') })
        )
      )

    const workspace = editor.workspace as Workspace

    if (
      !workspace.author._id.equals(user._id) &&
      !workspace.contributors.some((contributor) => contributor._id.equals(user._id))
    ) {
      return next(
        new Forbidden(
          prettyError({ message: req.t('editor.middlewares.editorGuard.index.forbbiden') })
        )
      )
    }

    res.locals.editor = editor
    next()
  } catch (error) {
    next(new BadRequest(prettyError(error)))
  }
}

export default editorGuard
