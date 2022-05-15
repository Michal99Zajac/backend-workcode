import { Server } from 'socket.io'
import randomcolor from 'randomcolor'

import { EditorModel } from '@root/models'
import { User } from '@users/schemas'
import { auth } from '@common/middlewares'
import { RoomUser } from '@editor/types'

import { type, contentUpdate } from './helpers'
import { Command } from './commands'

const rooms: Record<string, RoomUser[]> = {}

export function initEditor(io: Server) {
  const editor = io.of('/editor')

  editor.use(auth)

  editor.on('connection', async (socket) => {
    const workspaceId = socket.request.headers.workspace as string
    const user = socket.handshake.query.user as any as User

    // create or assign to the room
    socket.join(workspaceId)
    const roomUser: RoomUser = {
      _id: user._id,
      color: randomcolor(),
    }
    rooms[workspaceId] = rooms[workspaceId] ? [...rooms[workspaceId], roomUser] : [roomUser]

    // find workspace editor
    const workspaceEditor = await EditorModel.findOne({ workspace: workspaceId })

    // send message about new connection
    editor.to(workspaceId).emit(Command.JOIN, rooms[workspaceId])

    // operations
    socket.on(
      Command.TYPE,
      type({
        emiter: editor.to(workspaceId).except(socket.id),
      })
    )
    socket.on(Command.CONTENT_UPDATE, contentUpdate({ workspaceEditor }))

    // handle disconnection
    socket.on(Command.DISCONNECT, async () => {
      socket.leave(workspaceId)
      rooms[workspaceId] = rooms[workspaceId].filter((roomUser) => roomUser._id !== user._id)
      editor.to(workspaceId).emit(Command.LEAVE, rooms[workspaceId])
    })
  })
}
