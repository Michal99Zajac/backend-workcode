import { Server } from 'socket.io'
import { ObjectID } from 'bson'

import { User } from '@users/schemas'
import { auth } from '@common/middlewares'

const rooms: Record<string, ObjectID[]> = {}

export function initEditor(io: Server) {
  const editor = io.of('/editor')

  editor.use(auth)

  editor.on('connection', (socket) => {
    const workspaceId = socket.request.headers.workspace as string
    const user = socket.handshake.query.user as any as User

    // create or assign to the room
    socket.join(workspaceId)
    if (rooms[workspaceId]) {
      rooms[workspaceId] = [...rooms[workspaceId], user._id]
    } else {
      rooms[workspaceId] = [user._id]
    }

    // send message about new connection
    editor.to(workspaceId).emit('join', rooms[workspaceId])

    // operations

    // handle disconnection
    socket.on('disconnect', async () => {
      socket.leave(workspaceId)
      rooms[workspaceId] = rooms[workspaceId].filter((_id) => _id !== user._id)
      editor.to(workspaceId).emit('leave', rooms[workspaceId])
    })
  })
}
