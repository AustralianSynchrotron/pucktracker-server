import Server from 'socket.io'

export default function startServer() {
  const io = new Server().attach(8090)
  io.on('connection', (socket) => {
    socket.on('action', action => {
      action['broadcast'] = false
      io.emit('action', action)
    })
  })
}
