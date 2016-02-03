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

  describe('/dewars/new', () => {

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

  describe('/dewars/<dewar_id>', () => {

    it('returns dewars when id exists', done => {
      Dewar.create([
        {name: 'first-dewar'},
        {name: 'second-dewar'},
      ]).then(dewars => {
        request
          .get('/dewars/' + dewars[0].id)
          .expect(res => {
            expect(res.body.data.name).to.eql('first-dewar')
          })
          .expect(200, done)
      }).catch(done)
    })

    it('response with a 404 for non-existant id', done => {
      request
        .get('/dewars/an-id-that-does-not-exist')
        .expect(res => {
          expect(res.body.error).to.be.a('string')
        })
        .expect(404, done)
    })

  })

})
