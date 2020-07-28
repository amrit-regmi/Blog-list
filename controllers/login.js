const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt')
const loginRouter = require ('express').Router()
const User = require('../models/user')

loginRouter.post('/',async(request,response) => {
  const body = request.body
  const user = await User.findOne({ username: body.username })
  const passWordMatch = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

  if(!(user && passWordMatch)){
    const error = new Error('Invalid Username or Password')
    error.name = 'AuthError'
    throw error
  }

  const userToken = {
    username: user.username,
    id: user._id
  }

  // eslint-disable-next-line no-undef
  const token = jwt.sign(userToken,process.env.SECRET)
  response.status(200).send({ token,username:user.username, name: user.name })
})

module.exports = loginRouter

