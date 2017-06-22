import test from 'tape'
import sinon from 'sinon'
import Promise from 'bluebird'
import server from '../..'
import {signToken} from './auth.service'
import User from './../user/user.model'

test('POST /v1/auth/local should return a jwt token of the id if valid', (t) => {
  t.plan(1)
  const payload = { email: 'some@email.com', password: '123' }
  let user = new User(payload)
  user._id = 'myid'
  user.salt = '123'
  user.encryptPassword(user.password, (err, hashedPassword) => {
    console.log('naice', hashedPassword)
    user.password = hashedPassword
    sinon.stub(User, 'findOne')
      .returns({
        exec: () => Promise.resolve(user)
      })

    const options = {
      method: 'POST',
      url: '/v1/auth/local',
      payload: payload
    }
    server.inject(options, function (res) {
      User.findOne.restore()
      t.ok(res.result.token, signToken(user._id))
    })
  })
})

test('POST /v1/auth/local should return unauthorized if user is not found', (t) => {
  t.plan(1)
  const payload = { email: 'some@email.com', password: '123' }
  sinon.stub(User, 'findOne')
    .returns({
      exec: () => Promise.resolve(null)
    })

  const options = {
    method: 'POST',
    url: '/v1/auth/local',
    payload: payload
  }
  server.inject(options, function (res) {
    User.findOne.restore()
    t.equal(res.statusCode, 401)
  })
})

test('POST /v1/auth/local should return unauthorized if password doesnt match', (t) => {
  t.plan(1)
  const payload = { email: 'some@email.com', password: '123' }
  let user = new User()
  sinon.stub(User, 'findOne')
    .returns({
      exec: () => Promise.resolve(user)
    })

  const options = {
    method: 'POST',
    url: '/v1/auth/local',
    payload: payload
  }
  server.inject(options, function (res) {
    User.findOne.restore()
    t.equal(res.statusCode, 401)
  })
})
