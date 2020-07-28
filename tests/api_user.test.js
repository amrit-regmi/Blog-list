const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require ('supertest')
const User = require ('../models/user')
const app = require('../app')
const helper = require('./api_test_helper')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('rootPassword',10)
  const user = new User ({ name:'Root User', username:'root', passwordHash })
  await user.save()
})

const api = supertest(app)


describe('While creating new User', () => {
  test('invalid username returns 400 + message and is not created', async() => {
    const initialUsers = await helper.usersInDb()
    const newUser = {
      name: 'tester user',
      username: 'ot',
      password: 'test'
    }
    const result = await api.post('/api/users').send(newUser).expect(400)

    expect(result.body.error).toContain('User validation failed:')
    const finalUser = await helper.usersInDb()
    expect(finalUser).toHaveLength(initialUsers.length)

    const usernames = finalUser.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)

  })

  test('non unique username returns 400 + message and is not created', async() => {
    const initialUsers = await helper.usersInDb()
    const newUser = {
      name: 'new user 1',
      username: 'root',
      password: 'test'
    }
    const result = await api.post('/api/users').send(newUser).expect(400)
    const finalUser = await helper.usersInDb()

    expect(result.body.error).toContain('`username` to be unique')
    expect(finalUser).toHaveLength(initialUsers.length)

  })

  test('creation succeeds with a fresh username ', async() => {
    const initialUsers = await helper.usersInDb()
    const newUser = {
      name: 'new user',
      username: 'testing',
      password: 'testing'
    }
    await api.post('/api/users').send(newUser).expect(200)
    const finalUser = await helper.usersInDb()

    const usernames = finalUser.map(u => u.username)
    expect(usernames).toContain(newUser.username)

    expect(finalUser).toHaveLength(initialUsers.length+1)

  })

  test ('invalid paswword returns 400 and message and is not created', async() => {
    const initialUsers = await helper.usersInDb()
    const newUser = {
      name: 'new user 2',
      username: 'testing2',
      password: ''
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('must be longer than 3 charcters')

    const finalUser = await helper.usersInDb()
    const usernames = finalUser.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)

    expect(finalUser).toHaveLength(initialUsers.length)
  })

})

afterAll(() => {
  mongoose.connection.close()
})


