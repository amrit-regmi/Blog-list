const errorHandler =(error,req,res,next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError'){
    return res.status(400).json({ error:error.message })
  }
  else if(error.name ==='AuthError'){
    return res.status(401).json({ error:error.message })
  }
  next(error)
}

module.exports = errorHandler
