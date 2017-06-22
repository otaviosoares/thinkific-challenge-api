import Joi from 'joi'
import {local} from './auth.controllers'

const UserRoutes = [
  {
    method: 'POST',
    path: '/v1/auth/local',
    handler: local,
    config: {
      tags: ['api'],
      validate: {
        payload: {
          email: Joi.string()
            .email()
            .required()
            .description('the user email to login'),
          password: Joi.string()
            .required()
            .description('the user password to login')
        }
      }
    }
  }
]

export default UserRoutes
