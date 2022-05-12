import { Server } from 'socket.io'

export function socket(io: Server) {
  io.on('connection', (socket) => {
    const workspace = socket.request.headers['workspace']
    socket.join(workspace)
    io.sockets.in(workspace).emit('join', 'You are in room ' + workspace)

    io.on('disconnect', async () => {
      console.log('disconnected')
    })
  })
}
