import { Server } from 'socket.io'

import { User } from '@users/schemas'
import { auth } from '@common/middlewares'

export function initEditor(io: Server) {
  const editor = io.of('/editor')

  editor.use(auth)

  editor.on('connection', (socket) => {
    const workspaceId = socket.request.headers.workspace as string
    const user = socket.handshake.query.user as any as User

    // create or assign to the room
    socket.join(workspaceId)

    // send message about new connection
    editor.to(workspaceId).except(socket.id).emit('join', user._id)

    // operations

    // handle disconnection
    socket.on('disconnect', async () => {
      editor.to(workspaceId).except(socket.id).emit('leave', user._id)
      socket.leave(workspaceId)
    })
  })
}
