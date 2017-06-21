import test from 'tape'
import sinon from 'sinon'
import Promise from 'bluebird'
import server from '../..'
import {signToken} from '../../auth/auth.service'
import User from './user.model'

test('POST /v1/user should save an user and return a jwt token of the id', (t) => {
  t.plan(2)
  const payload = { email: 'some@email.com', password: '123' }
  const response = { _id: 'myid' }
  sinon.mock(User.prototype)
    .expects('save')
    .once()
    .resolves({ _id: 'myid' })

  const options = {
    method: 'POST',
    url: '/v1/user',
    payload: payload
  }
  server.inject(options, function (res) {
    User.prototype.save.restore()
    t.equal(res.statusCode, 201, 'response status should match')
    t.equal(res.result.token, signToken(response._id))
  })
})

test('GET /v1/next should be secured', (t) => {
  t.plan(1)

  const options = {
    method: 'GET',
    url: '/v1/next'
  }
  server.inject(options, function (res) {
    t.equal(res.statusCode, 401, 'response status should match')
  })
})

test('GET /v1/next should return the next integer and save it', (t) => {
  t.plan(3)
  let stub = sinon.stub(User, 'findByIdAndUpdate')
    .returns({
      exec: () => Promise.resolve(new User())
    })

  const options = {
    method: 'GET',
    url: '/v1/next',
    credentials: {_id: 123}
  }
  server.inject(options, function (res) {
    t.equal(res.statusCode, 200, 'response status should match')
    t.equal(stub.getCall(0).args[0], options.credentials._id, 'should be passed the user _id')
    t.deepEqual(stub.getCall(0).args[1], { $inc: { integer: 1 } }, 'should use mongo $inc at the integer field')
    stub.restore()
  })
})

test('GET /v1/current should be secured', (t) => {
  t.plan(1)

  const options = {
    method: 'GET',
    url: '/v1/current'
  }
  server.inject(options, function (res) {
    t.equal(res.statusCode, 401, 'response status should match')
  })
})

test('GET /v1/current should return the current integer', (t) => {
  t.plan(3)
  let stub = sinon.stub(User, 'findById')
    .returns({
      exec: () => Promise.resolve({integer: 59})
    })

  const options = {
    method: 'GET',
    url: '/v1/current',
    credentials: {_id: 123}
  }
  server.inject(options, function (res) {
    t.equal(res.statusCode, 200, 'response status should match')
    t.equal(stub.getCall(0).args[0], options.credentials._id, 'should be passed the user _id')
    t.equal(res.result.integer, 59, 'should return the integer')
    stub.restore()
  })
})

test('PUT /v1/current should be secured', (t) => {
  t.plan(1)

  const options = {
    method: 'PUT',
    url: '/v1/current'
  }
  server.inject(options, function (res) {
    t.equal(res.statusCode, 401, 'response status should match')
  })
})

test('PUT /v1/current should replace the current integer', (t) => {
  t.plan(3)
  let stub = sinon.stub(User, 'findByIdAndUpdate')
    .returns({
      exec: () => Promise.resolve(new User())
    })
  const newInteger = 500
  const options = {
    method: 'PUT',
    url: '/v1/current',
    credentials: {_id: 123},
    payload: {
      integer: newInteger
    }
  }
  server.inject(options, function (res) {
    t.equal(res.statusCode, 200, 'response status should match')
    t.equal(stub.getCall(0).args[0], options.credentials._id, 'should be passed the user _id')
    t.deepEqual(stub.getCall(0).args[1], {$set: {integer: newInteger}}, 'should use mongo $set to replace the integer')
    stub.restore()
  })
})

test('PUT /v1/current should not allow a negative value', (t) => {
  t.plan(2)

  const options = {
    method: 'PUT',
    url: '/v1/current',
    credentials: {_id: 123},
    payload: {
      integer: -50
    }
  }
  server.inject(options, function (res) {
    t.equal(res.statusCode, 400, 'response status should match')
    t.equal(res.result.message, 'child "integer" fails because ["integer" must be a positive number]')
  })
})
