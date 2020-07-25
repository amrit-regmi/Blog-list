const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')


const mongoUrl = config.MONGODB_URI
logger.info('connecting to Mongo DB')
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => logger.info('Connected to MongoDb'))
  .catch(error => {
    logger.error('Failed to connect',error.message)
  })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app