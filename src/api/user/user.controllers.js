'use strict'

import User from './user.model'
import Boom from 'boom'
import {signToken} from '../../auth/auth.service'

function validationError (reply, statusCode) {
  return function (err) {
    return reply(Boom.badRequest(err.message))
  }
}

/**
 * Creates a new user
 */
export function create (request, reply) {
  let newUser = new User(request.payload)
  newUser.provider = 'local'
  newUser.save()
    .then(function (user) {
      var token = signToken(user._id)
      reply({ token }).code(201)
    })
    .catch(validationError(reply))
}

/**
 * Gets the next integer in the sequence
 */
export function next (request, reply) {
  let userId = request.auth.credentials._id
  User.findByIdAndUpdate(userId, { $inc: { integer: 1 } }, {new: true}).exec()
    .then(user => {
      return reply({integer: user.integer})
    })
    .catch(validationError(reply))
}

/**
 * Gets the current integer
 */
export function getCurrent (request, reply) {
  let userId = request.auth.credentials._id
  User.findById(userId).exec()
    .then(user => {
      return reply({integer: user.integer})
    })
    .catch(validationError(reply))
}

/**
 * Gets the current integer
 */
export function replaceCurrent (request, reply) {
  let userId = request.auth.credentials._id
  User.findByIdAndUpdate(userId, { $set: { integer: request.payload.integer } }, {new: true}).exec()
    .then(user => {
      return reply({integer: user.integer})
    })
    .catch(validationError(reply))
}
