const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs).end()
})

blogsRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
  response.json(blogs).end()
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result  = await blog.save()
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
  response.json(updatedBlog)
})

module.exports = blogsRouter