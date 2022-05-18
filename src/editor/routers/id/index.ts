import { Router } from 'express'

import { editorGuard } from '@editor/middlewares'
import { Editor } from '@editor/schemas'

export const router = Router()

router.get('/editors/:workspaceId', editorGuard, (req, res) => {
  const editor = res.locals.editor as Editor

  res.json(editor.public)
})

export default router
