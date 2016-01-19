import Server from 'socket.io'
import mongoose from 'mongoose'
import { handleAction } from './controller'
import Adaptor from './models/Adaptor'
import Dewar from './models/Dewar'
import Puck from './models/Puck'
import Port from './models/Port'

export default function startServer(config) {

  mongoose.connect(config.db)

  const io = new Server().attach(config.port)
  io.on('connection', socket => {

    Adaptor.find().sort({name: 1}).then(adaptors => {
      const action = {type: 'SET_ADAPTORS', adaptors, broadcast: false}
      socket.emit('action', action)
    })

    Dewar.find().sort({name: 1}).then(dewars => {
      const action = {type: 'SET_DEWARS', dewars, broadcast: false}
      socket.emit('action', action)
    })

    Puck.find().sort({name: 1}).then(pucks => {
      const action = {type: 'SET_PUCKS', pucks, broadcast: false}
      socket.emit('action', action)
    })

    Port.find().then(ports => {
      const action = {type: 'SET_PORTS', ports, broadcast: false}
      socket.emit('action', action)
    })

    socket.on('action', action => {
      if (!action) { return }
      action['broadcast'] = false
      handleAction(action).then(() => socket.broadcast.emit('action', action))
    })

  })

}
