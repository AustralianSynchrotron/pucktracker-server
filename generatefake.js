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
  let ports = []
  ;['ASP001', 'ASP002', 'ASP003'].forEach(container => {
    for (let number = 1; number <= 16; number += 1) {
      ports.push({
        containerType: 'puck',
        container,
        number,
      })
    }
  })
  return Port.create(ports)
}).then(() => {
  console.log('ports added')
})
