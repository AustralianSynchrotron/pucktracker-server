import { expect } from 'chai'
import mongoose from 'mongoose'
import config from '../../config'
import Dewar, { nextNameForEpn } from '../../src/models/Dewar'

mongoose.Promise = Promise

describe('Dewar', () => {

  before(() => {
    mongoose.connect(config.testing.db)
  })

  after(() => {
    mongoose.disconnect()
  })

  beforeEach(done => {
    Promise.all([
      Dewar.remove(),
    ]).then(() => done())
  })

  describe('nextNameForEpn', () => {

    it('creates a name when there are no other dewars for the epn', done => {
      nextNameForEpn('123a', name => {
        expect(name).to.eql('d-123a-1')
        done()
      })
    })

    it('creates a unique name if there are already dewars for the epn', done => {
      Dewar.create([{name: 'd-123a-1'}, {name: 'd-123a-2'}]).then(() => {
        nextNameForEpn('123a', name => {
          expect(name).to.eql('d-123a-3')
          done()
        })
      })
    })

  })

})
