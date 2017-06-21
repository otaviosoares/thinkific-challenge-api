import test from 'tape'
import sinon from 'sinon'

import {validateToken} from './auth.service'
import User from '../api/user/user.model'

require('sinon-mongoose')

test('Auth Strategy: validateToken should be true if user exists', (t) => {
  t.plan(3)
  const req = {
    user: {
      _id: 123
    }
  }
  const userResponse = { _id: 'myid' }
  sinon.mock(User)
    .expects('findById')
    .chain('exec')
    .once()
    .resolves(userResponse)
  validateToken({token: 'abc'}, req, (err, result, user) => {
    User.findById.restore()
    t.false(err, 'error should be null')
    t.true(result, 'result should be true')
    t.deepEqual(user, userResponse, 'user should be returned')
  })
})

test('Auth Strategy: validateToken should be true if user doesnt exist', (t) => {
  t.plan(3)
  const req = {
    user: {
      _id: 123
    }
  }
  sinon.mock(User)
    .expects('findById')
    .chain('exec')
    .once()
    .resolves(null)

  validateToken({token: 'abc'}, req, (err, result, user) => {
    User.findById.restore()
    t.false(err, 'error should be null')
    t.false(result, 'result should be false')
    t.notOk(user, 'user should not be returned')
    t.end()
  })
})
