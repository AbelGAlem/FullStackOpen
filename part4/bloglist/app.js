const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogsController')
const usersRouter = require('./controllers/usersController')
const loginRouter = require('./controllers/loginController')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.json())
app.use(express.static('dist'))
app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint)
// handler of errors
app.use(middleware.errorHandler)

module.exports = app