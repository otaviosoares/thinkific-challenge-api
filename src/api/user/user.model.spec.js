'use strict'
import test from 'tape'
import User from './user.model'
require('../..')

var createUser = function () {
  return new User({
    provider: 'local',
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password'
  })
}

const cleanDb = (cb) => {
  User.remove(cb)
}

test('should fail when saving a duplicate user', function (t) {
  t.plan(4)
  cleanDb(() => {
    let user = createUser()
    return user.save()
      .then((res) => {
        t.ok(res._id, 'user should have an id')
        t.equal(res.integer, 1, 'user integer should be initialized')
        let userDup = createUser()
        return userDup.save()
      })
      .catch((err) => {
        t.assert(err)
        t.equal(err.message, 'User validation failed: email: The specified email address is already in use.')
      })
  })
})

test('should fail when saving with a blank email', function (t) {
  t.plan(2)
  let user = createUser()
  user.email = ''
  return user.save().catch((err) => {
    t.ok(err)
    t.equal(err.message, 'User validation failed: email: Path `email` is required.')
  })
})

test('should fail when saving with a null email', function (t) {
  t.plan(2)
  let user = createUser()
  user.email = null
  return user.save().catch((err) => {
    t.ok(err)
    t.equal(err.message, 'User validation failed: email: Path `email` is required.')
  })
})

test('should fail when saving without an email', function (t) {
  t.plan(2)
  let user = createUser()
  user.email = undefined
  return user.save().catch((err) => {
    t.ok(err)
    t.equal(err.message, 'User validation failed: email: Path `email` is required.')
  })
})

test('should succeed when saving without an email and google provider', function (t) {
  t.plan(2)
  let user = createUser()
  user.provider = 'google'
  user.email = null
  return user.save()
    .then((res) => {
      t.ok(res._id, 'has an id')
      t.equal(res.provider, 'google')
    })
})

test('should succeed when saving without an email and google facebook', function (t) {
  t.plan(2)
  let user = createUser()
  user.provider = 'facebook'
  user.email = null
  return user.save()
    .then((res) => {
      t.ok(res._id, 'has an id')
      t.equal(res.provider, 'facebook')
    })
})

test('should succeed when saving without an email and google twitter', function (t) {
  t.plan(2)
  let user = createUser()
  user.provider = 'twitter'
  user.email = null
  return user.save()
    .then((res) => {
      t.ok(res._id, 'has an id')
      t.equal(res.provider, 'twitter')
    })
})

test('should succeed when saving without an email and google github', function (t) {
  t.plan(2)
  let user = createUser()
  user.provider = 'github'
  user.email = null
  return user.save()
    .then((res) => {
      t.ok(res._id, 'has an id')
      t.equal(res.provider, 'github')
    })
})

test('should fail when saving with a blank password', function (t) {
  t.plan(2)
  let user = createUser()
  user.password = ''
  cleanDb(() => {
    return user.save()
      .catch((err) => {
        t.ok(err)
        t.equal(err.message, 'User validation failed: password: Path `password` is required.')
      })
  })
})

test('should fail when saving with a null password', function (t) {
  t.plan(2)
  let user = createUser()
  user.password = null
  cleanDb(() => {
    return user.save()
      .catch((err) => {
        t.ok(err)
        t.equal(err.message, 'User validation failed: password: Path `password` is required.')
      })
  })
})

test('should fail when saving without a password', function (t) {
  t.plan(2)
  let user = createUser()
  user.password = undefined
  cleanDb(() => {
    return user.save()
      .catch((err) => {
        t.ok(err)
        t.equal(err.message, 'User validation failed: password: Path `password` is required.')
      })
  })
})

test('should authenticate user if valid', function (t) {
  t.plan(1)
  cleanDb(() => {
    let user = createUser()
    user.save()
      .then(() => {
        t.ok(user.authenticate('password'))
      })
  })
})

test('should not authenticate user if invalid', function (t) {
  t.plan(1)
  cleanDb(() => {
    let user = createUser()
    user.save()
    t.false(user.authenticate('blah'))
  })
})

test('should succeed when saving without a password and google provider', function (t) {
  t.plan(2)
  let user = createUser()
  user.provider = 'google'
  user.password = null
  return user.save()
    .then((res) => {
      t.ok(res._id, 'has an id')
      t.equal(res.provider, 'google')
    })
})

test('should succeed when saving without a password and facebook provider', function (t) {
  t.plan(2)
  let user = createUser()
  user.provider = 'facebook'
  user.password = null
  return user.save()
    .then((res) => {
      t.ok(res._id, 'has an id')
      t.equal(res.provider, 'facebook')
    })
})

test('should succeed when saving without a password and twitter provider', function (t) {
  t.plan(2)
  let user = createUser()
  user.provider = 'twitter'
  user.password = null
  return user.save()
    .then((res) => {
      t.ok(res._id, 'has an id')
      t.equal(res.provider, 'twitter')
    })
})

test('should succeed when saving without a password and github provider', function (t) {
  t.plan(2)
  let user = createUser()
  user.provider = 'github'
  user.password = null
  return user.save()
    .then((res) => {
      t.ok(res._id, 'has an id')
      t.equal(res.provider, 'github')
    })
})
