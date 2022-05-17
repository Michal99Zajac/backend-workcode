import { Router } from 'express'
import { BadRequest, NotFound } from 'http-errors'

import { EditorModel } from '@root/models'
import { prettyError } from '@common/utils'

export const router = Router()

// TODO: add guardian
router.get('/editors/:workspaceId', async (req, res, next) => {
  const workspaceId = req.params.workspaceId

  try {
    const editor = await EditorModel.findOne({ workspace: workspaceId })

    if (!editor)
      return next(
        new NotFound(prettyError({ message: req.t('editor.routers.id.index.not_found') }))
      )

    res.json(editor.public)
  } catch (error) {
    next(new BadRequest(prettyError(error)))
  }
})

export default router
