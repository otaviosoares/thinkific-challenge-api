import Joi from 'joi'
import {create, next, getCurrent, replaceCurrent} from './user.controllers'

const UserRoutes = [
  {
    method: 'POST',
    path: '/v1/user',
    handler: create,
    config: {
      tags: ['api'],
      validate: {
        payload: {
          email: Joi.string()
            .email()
            .required()
            .description('the user email to be registered'),
          password: Joi.string()
            .required()
            .description('the user password to be registered')
        }
      }
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
      auth: 'jwt',
      validate: {
        payload: {
          integer: Joi.number()
            .required()
            .positive()
            .description('the new integer')
        }
      }
    }
  }
]

export default UserRoutes
