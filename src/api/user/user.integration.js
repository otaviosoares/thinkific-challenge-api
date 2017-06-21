'use strict'

import test from 'tape'
import mongoose from 'mongoose'

import server from '../..'
import User from './user.model'

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

test('should register a user', function (t) {
  t.plan(2)
  cleanDb(() => {
    createUser((res) => {
      t.equal(res.statusCode, 201, 'response status should match')
      t.ok(res.result.token, 'should return a token')
    })
  })
})

test('should increment the integer', function (t) {
  t.plan(1)
  var token
  cleanDb(() => {
    createUser((res) => {
      token = res.result.token

      const options = {
        method: 'GET',
        url: '/v1/next',
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      server.inject(options, (res) => {
        t.equal(res.result.integer, 2)
      })
    })
  })
})

test('should replace the integer', function (t) {
  t.plan(1)
  var token
  cleanDb(() => {
    createUser((res) => {
      token = res.result.token
      const newInteger = 500
      const options = {
        method: 'PUT',
        url: '/v1/current',
        headers: {
          authorization: `Bearer ${token}`
        },
        payload: {
          integer: newInteger
        }
      }
      server.inject(options, (res) => {
        t.equal(res.result.integer, newInteger)
      })
    })
  })
})

test('should get the current integer', function (t) {
  t.plan(1)
  var token
  cleanDb(() => {
    createUser((res) => {
      token = res.result.token
      const options = {
        method: 'GET',
        url: '/v1/current',
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      server.inject(options, (res) => {
        t.equal(res.result.integer, 1)
      })
    })
  })
})
