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

    it('allows dewars to be added', done => {
      request
        .post('/dewars/new')
        .send({name: 'd-1234-1'})
        .expect(res => {
          expect(res.body.data).to.have.property('_id')
          expect(res.body.data.name).to.eql('d-1234-1')
          expect(res.body.error).to.be.a('null')
        }).expect(200, () => {
          Dewar.findOne((err, dewar) => {
            expect(dewar.name).to.equal('d-1234-1')
            done()
          })
        })
    })

    it('rejects duplicate dewars', () => {
      Dewar.create({name: 'd-1234-1'}).then(() => {
        request
          .post('/dewars/new')
          .send({name: 'd-1234-1'})
          .expect(res => {
            expect(res.body.error).to.be.a('string')
          })
          .expect(409, done)
      })
    })

  })

})
