import { Server } from 'socket.io'

import { auth } from '@common/middlewares'
import { User } from '@users/schemas'

import { Command } from './commands'
import { send } from './helpers'

export function initChat(socket: Server) {
  const chat = socket.of('/chat')

  chat.use(auth)

  chat.on(Command.CONNECTION, (socket) => {
    const workspaceId = socket.request.headers.workspace as string
    const user = socket.handshake.query.user as any as User

    // create or assign to the room
    socket.join(workspaceId)

    // operations
    socket.on(
      Command.SEND,
      send({
        emiter: chat.to(workspaceId),
        user: user,
      })
    )

    // handle disconnection
    socket.on(Command.DISCONNECT, async () => {
      socket.leave(workspaceId)
    })
  })
}
