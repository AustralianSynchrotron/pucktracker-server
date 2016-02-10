import { expect } from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'
import config from '../config'
import startServer from '../src/server'
import Dewar from '../src/models/Dewar'

describe('http server', () => {

  let server
  let request

  before(() => {
    server = startServer(config.testing)
    request = supertest(server)
  })

  after(() => {
    server.close()
    mongoose.disconnect()
  })

  beforeEach(done => {
    Promise.all([
      Dewar.remove(),
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
