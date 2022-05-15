import { Server } from 'socket.io'
import { ObjectID } from 'bson'

import { EditorModel } from '@root/models'
import { User } from '@users/schemas'
import { auth } from '@common/middlewares'

import { type } from './helpers'
import { Command } from './commands'

const rooms: Record<string, ObjectID[]> = {}

export function initEditor(io: Server) {
  const editor = io.of('/editor')

  editor.use(auth)

  editor.on('connection', async (socket) => {
    const workspaceId = socket.request.headers.workspace as string
    const user = socket.handshake.query.user as any as User

    // create or assign to the room
    socket.join(workspaceId)
    rooms[workspaceId] = rooms[workspaceId] ? [...rooms[workspaceId], user._id] : [user._id]

    // find workspace editor
    const workspaceEditor = await EditorModel.findOne({ workspace: workspaceId })

    // send message about new connection
    editor.to(workspaceId).emit(Command.JOIN, rooms[workspaceId])

    // operations
    socket.on(
      Command.TYPE,
      type({
        workspaceEditor: workspaceEditor,
        emiter: editor.to(workspaceId).except(socket.id),
        userId: user._id,
      })
    )

    // handle disconnection
    socket.on(Command.DISCONNECT, async () => {
      socket.leave(workspaceId)
      rooms[workspaceId] = rooms[workspaceId].filter((_id) => _id !== user._id)
      editor.to(workspaceId).emit(Command.LEAVE, rooms[workspaceId])
    })
  })
}
