import Server from 'socket.io'
import mongoose from 'mongoose'
import Adaptor from './models/Adaptor'
import Puck from './models/Puck'
import Port from './models/Port'

mongoose.connect('mongodb://localhost/pucktracker_dev')

export default function startServer() {

  const io = new Server().attach(8090)
  io.on('connection', socket => {

    Adaptor.find().then(adaptors => {
      const action = {type: 'SET_ADAPTORS', adaptors, broadcast: false}
      socket.emit('action', action)
    })

    Puck.find().then(pucks => {
      const action = {type: 'SET_PUCKS', pucks, broadcast: false}
      socket.emit('action', action)
    })

    Port.find().then(ports => {
      const action = {type: 'SET_PORTS', ports, broadcast: false}
      socket.emit('action', action)
    })

    socket.on('action', action => {
      if (action.type === 'SET_ADAPTOR_PLACE') {
        Adaptor.findOneAndUpdate(
          {name: action.adaptor},
          {location: action.location, position: action.position}
        ).then(() => {
          action['broadcast'] = false
          socket.broadcast.emit('action', action)
        })
      }
    })

  })

}
