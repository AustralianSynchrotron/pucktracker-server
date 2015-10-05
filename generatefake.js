import mongoose from 'mongoose'
import Adaptor from './src/models/Adaptor'
import Dewar from './src/models/Dewar'
import Puck from './src/models/Puck'
import Port from './src/models/Port'
import pucks from './pucks'
import config from './config'

const env = process.env.NODE_ENV || 'development'

mongoose.connect(config[env].db)

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
  return Puck.create(pucks)
}).then(() => {
  console.log('pucks added')
})

Port.remove().then(() => {
  let ports = []
  pucks.forEach(puck => {
    const container = puck.name
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
