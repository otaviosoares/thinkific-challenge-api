'use strict'

module.exports = {
  mongo: {
    uri: 'mongodb://localhost/thinkific-test'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false
      }
    }
  }
}
