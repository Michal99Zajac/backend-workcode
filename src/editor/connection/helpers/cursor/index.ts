import { BroadcastOperator } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { ObjectID } from 'bson'

import { Command } from '@editor/connection/commands'
import { Position } from '@editor/types'

interface Provider<D> {
  emiter: BroadcastOperator<DefaultEventsMap, D>
  userId: ObjectID
}

export const cursor =
  <D>(provider: Provider<D>) =>
  (cursor: Position) => {
    const { emiter, userId } = provider

    emiter.emit(Command.CURSOR_UPDATE, { cursor, userId })
  }

export default cursor
