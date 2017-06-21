'use strict'

import Hapi from 'hapi'
import mongoose from 'mongoose'
import HapiJwt from 'hapi-auth-jwt2'
import Inert from 'inert'
import Vision from 'vision'
import HapiSwagger from 'hapi-swagger'

import Pack  from '../package'
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
  Inert,
  Vision,
  HapiJwt,
  {
    register: HapiSwagger,
    options: {
      info: {
        title: 'Thinkific Integer Service API Documentation',
        version: Pack.version
      },
      securityDefinitions: {
        'jwt': {
          'type': 'apiKey',
          'name': 'Authorization',
          'in': 'header'
        }
      },
      security: [{ 'jwt': [] }]
    }
  }
]

server.register(plugins, () => {
  createJwtStrategy(server)
  server.route(routes)
  if (process.env !== 'TEST') {
    server.start((err) => {
      if (err) {
        throw err
      }
      console.log(`Server running at: ${server.info.uri}`)
    })
  }
})

export default server
