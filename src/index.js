'use strict'

import Hapi from 'hapi'

const server = new Hapi.Server()
server.connection({ port: 3000, host: 'localhost' })

server.route({
  method: 'POST',
  path: '/api/register/',
  handler: function (request, reply) {
    return reply('Hello, world!')
  }
})

if (!module.parent) {
  server.start((err) => {
    if (err) {
      throw err
    }
    console.log(`Server running at: ${server.info.uri}`)
  })
}

export default server
