import { expect } from 'chai'
import mongoose from 'mongoose'
import { handleAction } from '../src/controller'
import config from '../config'
import Dewar from '../src/models/Dewar'

mongoose.connect(config.testing.db)

beforeEach(next => {
  Dewar.remove().then(() => next())
})

describe('controller', () => {

  it('adds dewars', (next) => {
    const action = {
      type: 'ADD_DEWAR',
      dewar: {
        name: '1001',
      },
    }
    handleAction(action).then(
      () => Dewar.findOne((err, dewar) => {
        expect(dewar.name).to.equal('1001')
        next()
      }),
      next
    )
  })

})
