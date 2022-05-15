import { DocumentType } from '@typegoose/typegoose'

import { EditorModel } from '@root/models'
import { Editor } from '@editor/schemas'

interface Provider {
  workspaceEditor: DocumentType<Editor>
}

export const contentUpdate = (provider: Provider) => async (data: string) => {
  const { workspaceEditor } = provider

  EditorModel.contentRefresh(workspaceEditor._id, data)
}

export default contentUpdate
