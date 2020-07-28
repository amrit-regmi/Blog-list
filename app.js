const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const errorHandler = require ('./utils/errorHandler')

mongoose.set('useFindAndModify', false)
const mongoUrl = config.MONGODB_URI
logger.info('connecting to Mongo DB')
mongoose.connect(mongoUrl, { useCreateIndex:true, useNewUrlParser: true, useUnifiedTopology: true  }).then(() => logger.info('Connected to MongoDb'))
  .catch(error => {
    logger.error('Failed to connect',error.message)
  })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(errorHandler)

module.exports = app