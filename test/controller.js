import { expect } from 'chai'
import sinon from 'sinon'
import mongoose from 'mongoose'
import { handleAction } from '../src/controller'
import config from '../config'
import Dewar from '../src/models/Dewar'
import Adaptor from '../src/models/Adaptor'
import Puck from '../src/models/Puck'
import Port from '../src/models/Port'

mongoose.Promise = Promise

describe('controller', () => {

  let clock
  const TIME = new Date(2016, 0, 2, 3, 4, 5)

  before(() => {
    mongoose.connect(config.testing.db)
    clock = sinon.useFakeTimers(TIME.getTime())
  })

  after(() => {
    clock.restore()
    mongoose.disconnect()
  })

  beforeEach(done => {
    Promise.all([
      Dewar.remove(),
      Adaptor.remove(),
      Puck.remove(),
      Port.remove(),
    ]).then(() => done())
  })

  describe('ADD_DEWAR', () => {

    it('adds dewars', done => {
      const addedTime = new Date(2013, 0, 1, 0, 0, 0)
      const action = { type: 'ADD_DEWAR', dewar: { name: 'd-123a-1', addedTime } }
      handleAction(action).then(
        () => Dewar.findOne((err, dewar) => {
          expect(dewar.name).to.equal('d-123a-1')
          expect(dewar.addedTime).to.eql(addedTime)
          done()
        })
      ).catch(done)
    })

    it('sets addedTime to now if not given', done => {
      const action = { type: 'ADD_DEWAR', dewar: { name: 'd-123a-1' } }
      handleAction(action).then(
        () => Dewar.findOne((err, dewar) => {
          expect(dewar.addedTime).to.eql(TIME)
          done()
        })
      ).catch(done)
    })

    it('rejects duplicate dewars', done => {
      Dewar.create({name: 'd-123a-1'}).then(() => {
        const action = { type: 'ADD_DEWAR', dewar: { name: 'd-123a-1' } }
        handleAction(action).then(() => done('expected error')).catch(err => done())
      })
    })

  })

  describe('DELETE_DEWAR', () => {

    it('deletes dewars', done => {
      Dewar.create({name: 'd-123a-1'}).then(() => {
        const action = { type: 'DELETE_DEWAR', dewar: 'd-123a-1' }
        handleAction(action).then(() => {
          Dewar.findOne({name: 'd-123a-1'}, (err, dewar) => {
            expect(dewar).to.equal(null)
            done()
          })
        })
      })
    })

    it('clears pucks from deleted dewar', done => {
      const action = { type: 'DELETE_DEWAR', dewar: 'd-123a-1' }
      Promise.all([
        Dewar.create({name: 'd-123a-1'}),
        Puck.create({name: 'ASP001', receptacleType: 'dewar',
                     receptacle: 'd-123a-1'}),
      ]).then(
        () => handleAction(action)
      ).then(
        () => Puck.findOne()
      ).then(puck => {
        expect(puck.receptacleType).to.equal(null)
        expect(puck.receptacle).to.equal(null)
        done()
      }).catch(done)
    })

  })

  describe('UPDATE_DEWAR', () => {

    it('updates dewars', done => {
      const action = {
        type: 'UPDATE_DEWAR',
        dewar: 'd-123a-1',
        update: {epn: '456b'},
      }
      Dewar.create({name: 'd-123a-1', epn: '123a'})
        .then(() => handleAction(action))
        .then(() => Dewar.findOne())
        .then(dewar => {
          expect(dewar.epn).to.equal('456b')
          expect(dewar.arrivedTime).to.not.exist
          done()
        })
        .catch(done)
    })

    it('sets dewar arrival time', done => {
      const action = {
        type: 'UPDATE_DEWAR',
        dewar: 'd-123a-1',
        update: {onsite: true},
      }
      Dewar.create({name: 'd-123a-1', onsite: false})
        .then(() => handleAction(action))
        .then(() => Dewar.findOne())
        .then(dewar => {
          expect(dewar.onsite).to.equal(true)
          expect(dewar.arrivedTime).to.eql(TIME)
          done()
        })
        .catch(done)
    })

  })

  describe('SET_DEWAR_OFFSITE', () => {

    it('moves dewars offsite', done => {
      const time = new Date(2016, 0, 10, 11, 12, 13)
      const action = {
        type: 'SET_DEWAR_OFFSITE',
        dewar: 'd-123a-1',
        time,
      }
      Promise.all([
        Dewar.create({name: 'd-123a-1', onsite: true}),
        Puck.create({name: 'ASP001', receptacleType: 'dewar',
                     receptacle: 'd-123a-1'}),
      ]).then(
        () => handleAction(action)
      ).then(
        () => Promise.all([ Dewar.findOne(), Puck.findOne() ])
      ).then(([dewar, puck]) => {
        expect(dewar.onsite).to.equal(false)
        expect(dewar.departedTime).to.eql(time)
        expect(puck.receptacleType).to.equal(null)
        expect(puck.receptacle).to.equal(null)
        done()
      }).catch(done)
    })

    it('sets departedTime to now if not given', done => {
      const action = {type: 'SET_DEWAR_OFFSITE', dewar: 'd-123a-1'}
      Dewar.create({name: 'd-123a-1', onsite: true})
        .then(() => handleAction(action))
        .then(() => Dewar.findOne())
        .then(dewar => {
          expect(dewar.departedTime).to.eql(TIME)
          done()
        })
        .catch(done)
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
      return Puck.findOne((err, puck) => {
        expect(puck.name).to.equal('ASP001')
      })
    }).then(() => {
      return Port.find().sort('number').exec((err, ports) => {
        expect(ports).to.have.length(16)
        const firstPort = ports[0]
        const lastPort = ports[15]
        expect(firstPort.containerType).to.equal('puck')
        expect(firstPort.container).to.equal('ASP001')
        expect(firstPort.number).to.equal(1)
        expect(lastPort.number).to.equal(16)
      })
    }).then(() => done())
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

  it('sets puck receptacles', done => {
    Puck.create({name: 'ASP001', lastDewar: 'd-123a-1'}).then(() => {
      const action = {
        type: 'SET_PUCK_RECEPTACLE',
        puck: 'ASP001',
        receptacleType: 'adaptor',
        receptacle: 'AS-01',
        slot: 'A',
      }
      handleAction(action).then(() => {
        Puck.findOne((err, puck) => {
          expect(puck.receptacleType).to.equal('adaptor')
          expect(puck.receptacle).to.equal('AS-01')
          expect(puck.slot).to.equal('A')
          expect(puck.lastDewar).to.equal('d-123a-1')
          done()
        })
      })
    })
  })

  it('sets the last dewar when putting a puck in a dewar', done => {
    Puck.create({name: 'ASP001', lastDewar: 'd-123a-1'}).then(() => {
      const action = {
        type: 'SET_PUCK_RECEPTACLE',
        puck: 'ASP001',
        receptacleType: 'dewar',
        receptacle: 'd-456b-1',
      }
      handleAction(action).then(() => {
        Puck.findOne((err, puck) => {
          expect(puck.receptacleType).to.equal('dewar')
          expect(puck.receptacle).to.equal('d-456b-1')
          expect(puck.lastDewar).to.equal('d-456b-1')
          done()
        })
      })
    })
  })

  it('sets port states', done => {
    Port.create({container: 'ASP001', number: 1}).then(() => {
      const action = {
        type: 'SET_PORT_STATE',
        container: 'ASP001',
        number: 1,
        state: 'full',
      }
      handleAction(action).then(() => {
        Port.findOne((err, port) => {
          expect(port.state).to.equal('full')
          done()
        })
      })
    })
  })

  it('sets multiple port states', done => {
    const ports = [
      {container: 'ASP001', number: 1, state: 'unknown'},
      {container: 'ASP001', number: 2, state: 'unknown'},
      {container: 'ASP001', number: 3, state: 'unknown'},
    ]
    Port.create(ports).then(() => {
      const action = {
        type: 'SET_MULTIPLE_PORT_STATES',
        container: 'ASP001',
        numbers: [1, 3],
        state: 'full',
      }
      handleAction(action).then(() => {
        Port.find().sort('number').exec((err, ports) => {
          expect(ports[0].state).to.equal('full')
          expect(ports[1].state).to.equal('unknown')
          expect(ports[2].state).to.equal('full')
          done()
        })
      })
    })
  })

  it('clears all data', done => {
    const action = {type: 'REMOVE_ALL'}
    Promise.all([
      Dewar.create({name: 'd-123a-1'}),
      Adaptor.create({name: 'AS-01'}),
      Puck.create({name: 'ASP001'}),
      Port.create({container: 'AS-01', number: 1})
    ]).then(
      () => handleAction(action)
    ).then(
      () => Promise.all([Dewar.findOne(), Adaptor.findOne(),
                         Puck.findOne(), Port.findOne()])
    ).then(([dewar, adaptor, puck, port]) => {
      expect(dewar).to.be.null
      expect(adaptor).to.be.null
      expect(puck).to.be.null
      expect(port).to.be.null
      done()
    }).catch(done)
  })

  describe('DEWAR_FILLED', () => {

    it('sets dewar filled time when time is given', done => {
      const time = new Date(2016, 0, 10, 11, 12, 13)
      const action = {
        type: 'DEWAR_FILLED',
        dewar: 'd-123a-1',
        time,
      }
      Dewar.create({name: 'd-123a-1'})
        .then(() => handleAction(action))
        .then(() => Dewar.findOne())
        .then(dewar => {
          expect(dewar.filledTime).to.eql(time)
          done()
        })
        .catch(done)
    })

    it('sets dewar filled time when time is not given', done => {
      const action = {
        type: 'DEWAR_FILLED',
        dewar: 'd-123a-1',
      }
      Dewar.create({name: 'd-123a-1'})
        .then(() => handleAction(action))
        .then(() => Dewar.findOne())
        .then(dewar => {
          expect(dewar.filledTime).to.eql(TIME)
          done()
        })
        .catch(done)
    })

  })

})
