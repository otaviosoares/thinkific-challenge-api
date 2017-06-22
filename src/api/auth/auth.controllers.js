'use strict'

import Boom from 'boom'
import User from './../user/user.model'
import {signToken} from './auth.service'

function validationError (reply) {
  return function (err) {
    return reply(Boom.badRequest(err.message))
  }
}

/**
 * Locally authenticates the user
 */
export function local (request, reply) {
  User.findOne({
    email: request.payload.email.toLowerCase()
  }).exec()
    .then(user => {
      if (!user) {
        return reply(Boom.unauthorized('Invalid credentials'))
      }
      user.authenticate(request.payload.password, function (err, authenticated) {
        console.log('qq deu', err, authenticated)
        if (err) {
          return reply(Boom.internal(err))
        }
        if (!authenticated) {
          return reply(Boom.unauthorized('Invalid credentials'))
        } else {
          var token = signToken(user._id)
          reply({ token }).code(201)
        }
      })
    })
    .catch(validationError(reply))
}
