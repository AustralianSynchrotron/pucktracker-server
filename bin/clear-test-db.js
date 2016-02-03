import mongoose from 'mongoose'
import Adaptor from '../src/models/Adaptor'
import Dewar from '../src/models/Dewar'
import Puck from '../src/models/Puck'
import Port from '../src/models/Port'
import config from '../config'

mongoose.Promise = Promise
mongoose.connect(config.testing.db)

Promise.all([
  Dewar.remove(),
  Adaptor.remove(),
  Puck.remove(),
  Port.remove(),
]).then(() => {
  console.log('Done')
  mongoose.disconnect()
})
