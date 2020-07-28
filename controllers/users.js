const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs',{ title:1, url:1, author:1 })
  response.json(users).end()
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const validatePassword = () => {
    if(body.password.length> 3 && body.password !== ''){
      return true
    }
    return false
  }

  if (!validatePassword()){
    const error = new Error('Password cannot be empty and must be longer than 3 charcters')
    error.name = 'ValidationError'
    throw error
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash
  })

  const saved = await user.save()
  response.json(saved).end()
})

module.exports = usersRouter