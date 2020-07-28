const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{ name:1,id:1,username:1 })
  response.json(blogs).end()
})

blogsRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
  response.json(blogs).end()
})

blogsRouter.post('/', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    const error = new Error('Token missing or invalid')
    error.name = 'AuthError'
    throw error
  }

  const user = await User.findById(decodedToken.id)
  const userId = user._id
  const newblogObject = { ...request.body, user:userId }
  const blog = new Blog( newblogObject )
  const result  = await blog.save()

  const udateUserObject = { blogs : user.blogs.concat(result._id) }

  await User.findByIdAndUpdate(userId, udateUserObject, { new:true , runValidators: true,context: 'query' })
  response.status(201).json(result).end()
})

blogsRouter.delete('/:id', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    const error = new Error('Token missing or invalid')
    error.name = 'AuthError'
    throw error
  }

  const user = await User.findById(decodedToken.id)
  if(!user.blogs.includes(request.params.id)){
    const error = new Error('Current user do not have permission to delete this post')
    error.name = 'AuthError'
    throw error
  }

  await Blog.findByIdAndRemove(request.params.id)
  user.blogs = user.blogs.filter( blogId => {
    return blogId.toString() !== request.params.id
  })

  await user.save()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const toUpdate = { likes: body.likes }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,toUpdate, { new:true , runValidators: true,context: 'query' })
  response.json(updatedBlog).end()
})

module.exports = blogsRouter