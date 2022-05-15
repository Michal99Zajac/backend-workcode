import { BroadcastOperator } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import { User } from '@users/schemas'
import { Message } from '@chat/types'
import { Command } from '@chat/connection/commands'

interface Provider<D> {
  emiter: BroadcastOperator<DefaultEventsMap, D>
  user: User
}

export const send =
  <D>(provider: Provider<D>) =>
  async (message: Message) => {
    const { emiter, user } = provider

    emiter.emit(Command.RECIVE, {
      userId: user._id,
      message: message.message,
      createdAt: message.createdAt,
    })
  }
