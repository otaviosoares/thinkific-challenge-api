import {create, next, getCurrent, replaceCurrent} from './user.controllers'

const UserRoutes = [
  {
    method: 'POST',
    path: '/v1/user',
    handler: create
  },
  {
    method: 'GET',
    path: '/v1/next',
    handler: next,
    config: {
      auth: 'token'
    }
  },
  {
    method: 'GET',
    path: '/v1/current',
    handler: getCurrent,
    config: {
      auth: 'token'
    }
  },
  {
    method: 'PUT',
    path: '/v1/current',
    handler: replaceCurrent,
    config: {
      auth: 'token'
    }
  }
]

export default UserRoutes
