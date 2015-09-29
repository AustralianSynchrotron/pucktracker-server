import mongoose from 'mongoose'
import Adaptor from './src/models/Adaptor'
import Dewar from './src/models/Dewar'
import Puck from './src/models/Puck'
import Port from './src/models/Port'

mongoose.connect('mongodb://localhost/pucktracker_dev')

Adaptor.remove().then(() => {
  const adaptors = Array.apply(null, Array(24)).map((e, idx) => {
    const n = idx + 1
    const pad = n < 10 ? '0' : ''
    return {name: `AS-${pad}${n}`}
  })
  return Adaptor.create(adaptors)
}).then(() => {
  console.log('adaptors added')
})

Dewar.remove().then(() => {
  return Dewar.create([
    {name: '1001', epn: '123a'},
    {name: '1002', epn: '456b'},
  ])
}).then(() => {
  console.log('dewars added')
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
