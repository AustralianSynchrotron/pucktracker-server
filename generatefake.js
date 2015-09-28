import mongoose from 'mongoose'
import Adaptor from './src/models/Adaptor'
import Puck from './src/models/Puck'
import Port from './src/models/Port'

mongoose.connect('mongodb://localhost/pucktracker_dev')

Adaptor.remove().then(() => {
  return Adaptor.create([
    {name: 'AS-01', location: 'MX1', position: 'Left'},
    {name: 'AS-02'},
  ])
}).then(() => {
  console.log('adaptors added')
})

Puck.remove().then(() => {
  return Puck.create([
    {name: 'ASP001', receptacleType: 'adaptor', receptacle: 'AS-01', slot: 'A'},
    {name: 'ASP002', receptacleType: 'dewar', receptacle: '1001'},
    {name: 'ASP003', receptacleType: 'adaptor', receptacle: 'AS-01', slot: 'C'},
  ])
}).then(() => {
  console.log('pucks added')
})

Port.remove().then(() => {
  return Port.create([
    {container: 'ASP001', containerType: 'puck', number: 1, state: 'full'},
    {container: 'ASP001', containerType: 'puck', number: 2, state: 'full'},
    {container: 'ASP001', containerType: 'puck', number: 3, state: 'full'},
    {container: 'ASP001', containerType: 'puck', number: 4, state: 'full'},
    {container: 'ASP001', containerType: 'puck', number: 5, state: 'full'},
    {container: 'ASP001', containerType: 'puck', number: 6, state: 'full'},
    {container: 'ASP001', containerType: 'puck', number: 7, state: 'full'},
    {container: 'ASP001', containerType: 'puck', number: 8, state: 'full'},
    {container: 'ASP001', containerType: 'puck', number: 9, state: 'full'},
    {container: 'ASP001', containerType: 'puck', number: 10, state: 'full'},
    {container: 'ASP001', containerType: 'puck', number: 11, state: 'full'},
    {container: 'ASP001', containerType: 'puck', number: 12, state: 'empty'},
    {container: 'ASP001', containerType: 'puck', number: 13, state: 'empty'},
    {container: 'ASP001', containerType: 'puck', number: 14, state: 'empty'},
    {container: 'ASP001', containerType: 'puck', number: 15, state: 'unknown'},
    {container: 'ASP001', containerType: 'puck', number: 16, state: 'unknown'},
  ])
}).then(() => {
  console.log('ports added')
})
