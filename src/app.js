'use strict'

import Hapi from 'hapi'
import mongoose from 'mongoose'
import HapiJwt from 'hapi-auth-jwt2'

import config from './config/environment'
import routes from './api/routes'
import {createJwtStrategy} from './auth/auth.service'

// thinkific
// lMmRxgvAenCVRJQV

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options)
mongoose.connection.on('error', function (err) {
  console.error(`MongoDB connection error: ${err}`)
  process.exit(-1)
})

const server = new Hapi.Server()
server.connection({ port: config.port, host: 'localhost' })

let plugins = [
  HapiJwt
]

server.register(plugins, () => {
  createJwtStrategy(server)
  server.route(routes)

  if (!module.parent) {
    server.start((err) => {
      if (err) {
        throw err
      }
      console.log(`Server running at: ${server.info.uri}`)
    })
  }
})

export default server
