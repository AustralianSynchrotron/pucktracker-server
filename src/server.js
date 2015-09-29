import Server from 'socket.io'
import mongoose from 'mongoose'
import Adaptor from './models/Adaptor'
import Dewar from './models/Dewar'
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

    Dewar.find().then(dewars => {
      const action = {type: 'SET_DEWARS', dewars, broadcast: false}
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
      action['broadcast'] = false
      switch (action.type) {
        case 'SET_ADAPTOR_PLACE': {
          Adaptor.findOneAndUpdate(
            {name: action.adaptor},
            {location: action.location, position: action.position}
          ).then(() => {
            socket.broadcast.emit('action', action)
          })
          break
        }
        case 'SET_PORT_STATE': {
          Port.findOneAndUpdate(
            {container: action.container, number: action.number},
            {state: action.state}
          ).then(() => {
            socket.broadcast.emit('action', action)
          })
          break
        }
        case 'SET_MULTIPLE_PORT_STATES': {
          Port.update(
            {container: action.container, number: {$in: action.numbers}},
            {state: action.state},
            {multi: true }
          ).then(() => {
            socket.broadcast.emit('action', action)
          })
          break
        }
        case 'SET_PUCK_RECEPTACLE': {
          Puck.findOneAndUpdate(
            {name: action.puck},
            {
              receptacle: action.receptacle,
              receptacleType: action.receptacleType,
              slot: action.slot,
            }
          ).then(() => {
            socket.broadcast.emit('action', action)
          })
          break
        }
        case 'ADD_DEWAR': {
          Dewar.create(action.dewar).then(() => {
            socket.broadcast.emit('action', action)
          })
          break
        }
        case 'UPDATE_DEWAR': {
          Dewar.findOneAndUpdate(
            {name: action.dewar},
            action.update
          ).then(() => {
            socket.broadcast.emit('action', action)
          })
          break
        }
      }
    })

  })

}
