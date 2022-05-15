import { BroadcastOperator } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import { Command } from '@editor/connection/commands'
import { EditorChange } from '@editor/types'

interface Provider<D> {
  emiter: BroadcastOperator<DefaultEventsMap, D>
}

export const type =
  <D>(provider: Provider<D>) =>
  async (data: EditorChange) => {
    const { emiter } = provider
    emiter.emit(Command.UPDATE, data)
  }

export default type
