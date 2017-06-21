import {create, next, getCurrent, replaceCurrent} from './user.controllers'

const UserRoutes = [
  {
    method: 'POST',
    path: '/v1/user',
    handler: create,
    config: {
      tags: ['api']
    }
  },
  {
    method: 'GET',
    path: '/v1/next',
    handler: next,
    config: {
      tags: ['api'],
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/v1/current',
    handler: getCurrent,
    config: {
      tags: ['api'],
      auth: 'jwt'
    }
  },
  {
    method: 'PUT',
    path: '/v1/current',
    handler: replaceCurrent,
    config: {
      tags: ['api'],
      auth: 'jwt'
    }
  }
]

export default UserRoutes
