import { expect } from 'chai'
import mongoose from 'mongoose'
import config from '../../config'
import Dewar, {
  nextNameForEpn, parseExpectedContainers
} from '../../src/models/Dewar'
import Puck from '../../src/models/Puck'

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
      Puck.remove(),
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

  describe('parseExpectedContainers', () => {
    it('parses simple numbers', () => {
      expect(parseExpectedContainers('1 | 2')).to.eql(['ASP0001', 'ASP0002'])
    })
    it('ignores leading and trailing spaces', () => {
      expect(parseExpectedContainers('   1     ')).to.eql(['ASP0001'])
    })
    it('ignores empty slots', () => {
      const parsed = parseExpectedContainers('1 |  | 2 | ')
      expect(parsed).to.eql(['ASP0001', 'ASP0002'])
    })
    it('parses numbers with leading letters', () => {
      const parsed = parseExpectedContainers('aspo1 | AS02')
      expect(parsed).to.eql(['ASP0001', 'ASP0002'])
    })
  })


  describe('expectedPucks', () => {
    it('finds pucks that match expected containers', done => {
      Puck.create([{name: 'ASP0001'}, {name: 'ASP0002'}, {name: 'ASP0003'}])
        .then(() => Dewar.create({name: 'd-123a-1', expectedContainers: '1 | 2'}))
        .then(dewar => dewar.expectedPucks())
        .then(expectedPucks => {
          expect(expectedPucks).to.have.length(2)
          const names = expectedPucks.map(puck => puck.name).sort()
          expect(names).to.eql(['ASP0001', 'ASP0002'])
          done()
        }).catch(done)
    })
    it('returns an empty list if expectedContainers is undefined', done => {
      Dewar.create({name: 'd-123a-1'})
        .then(dewar => dewar.expectedPucks())
        .then(expectedPucks => {
          expect(expectedPucks).to.have.length(0)
          done()
        }).catch(done)
    })
  })

  it('stores piEmail', done => {
    Dewar.create({name: 'd-123a-1', piEmail: 'jane@example.com'})
      .then(dewar => { expect(dewar.piEmail).to.equal('jane@example.com'); done() })
      .catch(done)
  })

  it('stores the beamline', done => {
    Dewar.create({name: 'd-123a-1', beamline: 'MX1'})
      .then(dewar => { expect(dewar.beamline).to.equal('MX1'); done() })
      .catch(done)
  })

})
