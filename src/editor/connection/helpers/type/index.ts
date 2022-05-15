import { BroadcastOperator } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { ObjectID } from 'bson'
import { DocumentType } from '@typegoose/typegoose'

import { EditorModel } from '@root/models'
import { Editor } from '@editor/schemas'
import { Command } from '@editor/connection/commands'

interface Provider<D> {
  emiter: BroadcastOperator<DefaultEventsMap, D>
  workspaceEditor: DocumentType<Editor>
  userId: ObjectID
}

export const type =
  <D>(provider: Provider<D>) =>
  async (data: any) => {
    const { emiter, workspaceEditor, userId } = provider
    emiter.emit(Command.UPDATE, {
      user: userId,
      change: data,
    })

    await EditorModel.updateOne(
      { workspace: workspaceEditor._id },
      { content: 'aaaaaaaaaaaaaaaaaaaa' }
    )
  }

export default type
