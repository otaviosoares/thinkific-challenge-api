import test from 'tape'
import server from '../../src/index'

test('should exist a POST /api/register endpoint', (t) => {
  t.plan(1)
  const options = {
    method: 'POST',
    url: '/api/register/'
  }
  server.inject(options, function (response) {
    t.equal(response.statusCode, 200)
  })
})
