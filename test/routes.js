import { expect } from 'chai'
import sinon from 'sinon'
import mongoose from 'mongoose'
import supertest from 'supertest'
import config from '../config'
import startServer from '../src/server'
import Dewar from '../src/models/Dewar'
import Puck from '../src/models/Puck'

describe('http server', () => {

  let server
  let request
  let clock
  const TIME = new Date(2016, 0, 2, 3, 4, 5)

  before(() => {
    server = startServer(config.testing)
    request = supertest(server)
    clock = sinon.useFakeTimers(TIME.getTime())
  })

  after(() => {
    clock.restore()
    server.close()
    mongoose.disconnect()
  })

  beforeEach(done => {
    Promise.all([
      Dewar.remove(),
      Puck.remove(),
    ]).then(() => done())
  })

  describe('POST /dewars/new', () => {

    it('requires an epn', done => {
      request
        .post('/dewars/new')
        .send({})
        .expect(res => {
          expect(res.body.error).to.be.a('string')
        })
        .expect(400, done)
    })

    it('allows dewars to be added', done => {
      request
        .post('/dewars/new')
        .send({epn: '1234a'})
        .expect(res => {
          expect(res.body.data).to.have.property('_id')
          expect(res.body.data.name).to.eql('d-1234a-1')
          expect(res.body.error).to.be.a('null')
        }).expect(200, () => {
          Dewar.findOne((err, dewar) => {
            expect(dewar.name).to.equal('d-1234a-1')
            done()
          })
        })
    })

    it('increments dewar number', done => {
      Dewar.create([{name: 'd-1234a-2', epn: '1234a'}]).then(() => {
        request
          .post('/dewars/new')
          .send({epn: '1234a'})
          .expect(res => {
            expect(res.body.data.name).to.eql('d-1234a-3')
          })
          .expect(200, done)
      })
    })

    it('sets the addedTime', done => {
      request
        .post('/dewars/new')
        .send({epn: '1234a'})
        .expect(200, () => {
          Dewar.findOne().then(dewar => {
            expect(dewar.addedTime).to.eql(TIME)
            done()
          }).catch(done)
        })
    })

    it('sets receptacle for expected pucks', done => {
      const requestBody = {
        epn: '1234a',
        containerType: 'pucks',
        expectedContainers: '1 | asp02 | 3 | bad | | | | ',
      }
      Puck.create([
        {name: 'ASP0001'},
        {name: 'ASP0002'},
        {name: 'ASP0003', receptacle: 'somewhere'},
      ]).then(() => {
        request
          .post('/dewars/new')
          .send(requestBody)
          .expect(200, () => {
            Puck.find().sort('name').then(([puck1, puck2, puck3]) => {
              expect(puck1.receptacle).to.equal('d-1234a-1')
              expect(puck1.receptacleType).to.equal('dewar')
              expect(puck2.receptacle).to.equal('d-1234a-1')
              expect(puck3.receptacle).to.equal('somewhere')
              done()
            }).catch(done)
          })
      })
    })

  })

  describe('GET /dewars/<dewar_name>', () => {

    it('returns dewars when name exists', done => {
      Dewar.create([
        {name: 'first-dewar'},
        {name: 'second-dewar'},
      ]).then(dewars => {
        request
          .get('/dewars/first-dewar')
          .expect(res => {
            expect(res.body.data.name).to.eql('first-dewar')
          })
          .expect(200, done)
      })
    })

    it('response with a 404 for non-existant dewar name', done => {
      request
        .get('/dewars/an-dewar-that-does-not-exist')
        .expect(res => {
          expect(res.body.error).to.be.a('string')
        })
        .expect(404, done)
    })

  })


  describe('POST /actions', () => {

    it('moves dewars onsite', done => {
      const action = {
        type: 'UPDATE_DEWAR',
        dewar: 'the-dewar',
        update: {onsite: true},
      }
      Dewar.create({name: 'the-dewar'}).then(dewar => {
        request
          .post('/actions')
          .send(action)
          .expect(200)
          .end(err => {
            if (err) return done(err)
            Dewar.findOne({name: 'the-dewar'}).then(dewar => {
              expect(dewar.onsite).to.equal(true)
              done()
            }).catch(done)
          })
      })
    })

    it('handles empty body gracefully', done => {
      request
        .post('/actions')
        .expect(res => {
          expect(res.body.error).to.be.a('string')
        })
        .expect(400, done)
    })

  })

})
