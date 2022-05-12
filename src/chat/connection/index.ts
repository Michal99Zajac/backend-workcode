import { Server } from 'socket.io'

export function initChat(socket: Server) {
  const chat = socket.of('/chat')

  chat.on('connection', (socket) => {
    const workspace = socket.request.headers['workspace']
    socket.join(workspace)
    chat.to(workspace).emit('join', 'You are in chat room: ' + workspace)

    chat.on('disconnect', async () => {
      console.log('disconnected')
    })
  })
}
