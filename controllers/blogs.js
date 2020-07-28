const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{ name:1,id:1,username:1 })
  response.json(blogs).end()
})

blogsRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
  response.json(blogs).end()
})

blogsRouter.post('/', async (request, response) => {
  const user = await User.find({})
  const userId = user[0]._id
  const newblogObject = { ...request.body, user:userId }
  const blog = new Blog( newblogObject )
  const result  = await blog.save()

  const udateUserObject = { blogs : user[0].blogs.concat(result._id) }

  await User.findByIdAndUpdate(userId, udateUserObject, { new:true , runValidators: true,context: 'query' })
  response.status(201).json(result).end()
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const toUpdate = { likes: body.likes }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,toUpdate, { new:true , runValidators: true,context: 'query' })
  response.json(updatedBlog).end()
})

module.exports = blogsRouter