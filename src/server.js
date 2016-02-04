import Server from 'socket.io'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import { handleAction } from './controller'
import Adaptor from './models/Adaptor'
import Dewar, { nextNameForEpn } from './models/Dewar'
import Puck from './models/Puck'
import Port from './models/Port'

mongoose.Promise = Promise

export default function startServer(config) {

  mongoose.connect(config.db)
  const io = new Server().attach(config.wsPort)

  function emitDatabaseState () {
    const action = {
      type: 'SET_DATABASE_CONNECTED',
      connected: mongoose.connection.readyState === 1,
    }
    io.emit('action', action)
  }

  mongoose.connection.on('connected', emitDatabaseState)
  mongoose.connection.on('disconnected', emitDatabaseState)

  io.on('connection', socket => {

    emitDatabaseState()

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

  let httpServer = express()
  httpServer.use(bodyParser.json())

  httpServer.post('/dewars/new', (req, res) => {
    const { body: data } = req
    if (!data.epn) {
      return res.status(400).json({error: 'Missing field: epn'})
    }
    nextNameForEpn(data.epn, name => {
      data.name = name
      Dewar.create(data).then(dewar => {
        io.emit('action', {type: 'ADD_DEWAR', dewar: dewar})
        res.json({data: dewar})
      }).catch(err => {
        res.status(409).json({error: err.message})
      })
    })
  })

  httpServer.get('/dewars/:id', (req, res) => {
    Dewar.findById(req.params.id).then(dewar => {
      res.json({data: dewar})
    }).catch(err => {
      res.status(404).json({error: err.message})
    })
  })

  httpServer.post('/actions', (req, res) => {
    const {body: action} = req
    handleAction(action).then(() => {
      io.emit('action', action)
      res.status(200).json({data: 'ok'})
    }).catch(err => {
      res.status(400).json({error: err.message})
    })
  })

  return httpServer.listen(config.httpPort, () => {
    console.log(`Listening on ${config.httpPort}`)
  })

}
