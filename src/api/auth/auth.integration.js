'use strict'

import test from 'tape'
import mongoose from 'mongoose'

import server from '../..'
import User from '../user/user.model'

const cleanDb = (cb) => {
  User.remove(cb)
}

const createUser = (cb) => {
  const options = {
    method: 'POST',
    url: '/v1/user',
    payload: {
      email: 'test@example.com',
      password: 'password'
    }
  }
  server.inject(options, cb)
}

test.onFinish(() => {
  cleanDb(() => {
    mongoose.disconnect()
  })
})

test('should login the user with valid credentials', function (t) {
  t.plan(1)
  cleanDb(() => {
    createUser((res) => {
      const options = {
        method: 'POST',
        url: '/v1/auth/local',
        payload: {
          email: 'test@example.com',
          password: 'password'
        }
      }
      server.inject(options, (res) => {
        t.ok(res.result.token)
      })
    })
  })
})

test('should return an error if wrong password', function (t) {
  t.plan(2)
  cleanDb(() => {
    createUser((res) => {
      const options = {
        method: 'POST',
        url: '/v1/auth/local',
        payload: {
          email: 'test@example.com',
          password: 'blah'
        }
      }
      server.inject(options, (res) => {
        t.equal(res.statusCode, 401)
        t.equal(res.result.message, 'Invalid credentials')
      })
    })
  })
})

test('should return an error if user not registered', function (t) {
  t.plan(2)
  cleanDb(() => {
    createUser((res) => {
      const options = {
        method: 'POST',
        url: '/v1/auth/local',
        payload: {
          email: 'blah@example.com',
          password: 'blah'
        }
      }
      server.inject(options, (res) => {
        t.equal(res.statusCode, 401)
        t.equal(res.result.message, 'Invalid credentials')
      })
    })
  })
})
