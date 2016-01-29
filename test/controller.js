import { expect } from 'chai'
import mongoose from 'mongoose'
import { handleAction } from '../src/controller'
import config from '../config'
import Dewar from '../src/models/Dewar'
import Adaptor from '../src/models/Adaptor'
import Puck from '../src/models/Puck'

mongoose.Promise = Promise
mongoose.connect(config.testing.db)

beforeEach(done => {
  Promise.all([
    Dewar.remove(),
    Adaptor.remove(),
    Puck.remove(),
  ]).then(() => done())
})

describe('controller', () => {

  it('adds dewars', done => {
    const action = { type: 'ADD_DEWAR', dewar: { name: '1001' } }
    handleAction(action).then(
      () => Dewar.findOne((err, dewar) => {
        expect(dewar.name).to.equal('1001')
        done()
      })
    ).catch(done)
  })

  it('rejects duplicate dewars', done => {
    Dewar.create({name: '1001'}).then(() => {
      const action = { type: 'ADD_DEWAR', dewar: { name: '1001' } }
      handleAction(action).then(() => done('expected error')).catch(err => done())
    })
  })

  it('deletes dewars', done => {
    Dewar.create({name: '1001'}).then(() => {
      const action = { type: 'DELETE_DEWAR', dewar: '1001' }
      handleAction(action).then(() => {
        Dewar.findOne({name: '1001'}, (err, dewar) => {
          expect(dewar).to.equal(null)
          done()
        })
      })
    })
  })

  it('updates dewars', done => {
    Dewar.create({name: '1001', epn: '123a'}).then(() => {
      const action = {
        type: 'UPDATE_DEWAR',
        dewar: '1001',
        update: {epn: '456b'},
      }
      handleAction(action).then(() => {
        Dewar.findOne({name: '1001'}, (err, dewar) => {
          expect(dewar.epn).to.equal('456b')
          done()
        })
      })
    })
  })

  it('moves dewars offsite', done => {
    Promise.all([
      Dewar.create({name: '1001', onsite: true}),
      Puck.create({name: 'ASP001', receptacleType: 'dewar', receptacle: '1001'}),
    ]).then(() => {
      const action = {type: 'SET_DEWAR_OFFSITE', dewar: '1001'}
      handleAction(action).then(() => {
        Dewar.findOne({name: '1001'}, (err, dewar) => {
          expect(dewar.onsite).to.equal(false)
          Puck.findOne({name: 'ASP001'}, (err, puck) => {
            expect(puck.receptacleType).to.equal(null)
            expect(puck.receptacle).to.equal(null)
            done()
          })
        })
      })
    })
  })

  it('updates adaptor places', done => {
    Adaptor.create({name: 'AS-01', location: 'LS3000', position: 'A'}).then(() => {
      const action = {
        type: 'SET_ADAPTOR_PLACE',
        adaptor: 'AS-01',
        location: 'MX1',
        position: 'Left',
      }
      handleAction(action).then(() => {
        Adaptor.findOne({name: 'AS-01'}, (err, adaptor) => {
          expect(adaptor.location).to.equal('MX1')
          expect(adaptor.position).to.equal('Left')
          done()
        })
      })
    })
  })

  it('adds pucks', done => {
    const action = {
      type: 'ADD_PUCK',
      puck: {name: 'ASP001'},
    }
    handleAction(action).then(() => {
      Puck.findOne((err, puck) => {
        expect(puck.name).to.equal('ASP001')
        done()
      })
    })
  })

  it('deletes pucks', done => {
    Puck.create({name: 'ASP001'}).then(() => {
      const action = {
        type: 'DELETE_PUCK',
        puck: 'ASP001',
      }
      handleAction(action).then(() => {
        Puck.findOne((err, puck) => {
          expect(puck).to.equal(null)
          done()
        })
      })
    })
  })

  it('updates pucks', done => {
    Puck.create({name: 'ASP001'}).then(() => {
      const action = {
        type: 'UPDATE_PUCK',
        puck: 'ASP001',
        update: {note: 'Test'},
      }
      handleAction(action).then(() => {
        Puck.findOne((err, puck) => {
          expect(puck.note).to.equal('Test')
          done()
        })
      })
    })
  })

})
