'use strict'

import jwt from 'jsonwebtoken'
import config from '../config/environment'
import User from '../api/user/user.model'

/**
 * Attaches the user object to the request credentials if authenticated
 * Otherwise returns 403
 */
export function validateToken (decoded, req, callback) {
  User.findById(decoded._id).exec()
    .then(user => {
      if (!user) {
        return callback(null, false)
      }
      user.token = decoded.token
      callback(null, true, user)
    })
    .catch(err => callback(err, false))
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken (id) {
  return jwt.sign({ _id: id }, config.secrets.session, {
    expiresIn: config.secrets.expiration
  })
}

/**
 * Creates the Hapi JWT strategy
 */
export function createJwtStrategy (server) {
  server.auth.strategy('jwt', 'jwt', {
    key: config.secrets.session,
    validateFunc: validateToken,
    verifyOptions: { algorithms: [ 'HS256' ] }
  })
}
