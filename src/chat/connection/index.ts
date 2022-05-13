import { Server } from 'socket.io'

import { auth } from '@common/middlewares'
import { User } from '@users/schemas'
import { CHAT_OPERATION, Message } from '@chat/types'

export function initChat(socket: Server) {
  const chat = socket.of('/chat')

  chat.use(auth)

  chat.on('connection', (socket) => {
    const workspaceId = socket.request.headers.workspace as string
    const user = socket.handshake.query.user as any as User

    // create or assign to the room
    socket.join(workspaceId)

    // operations
    socket.on(CHAT_OPERATION.SEND, (message: Message) => {
      chat.to(workspaceId).emit(CHAT_OPERATION.RECIVE, {
        userId: user._id,
        message: message.message,
        createdAt: message.createdAt,
      })
    })

    // handle disconnection
    socket.on('disconnect', async () => {
      socket.leave(workspaceId)
    })
  })
}
