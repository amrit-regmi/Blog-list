const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./api_test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlog.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

})

const api = supertest(app)

test('correct amount of blog post returned on GET /api/blogs ',async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlog.length)
})

test('unique identifer property is named id', async() => {
  const response = await api.get('/api/blogs')
  expect(response.body[0]['id']).toBeDefined()

})


test('POST to api/blogs creates new blog post', async() => {
  await api.post('/api/blogs').send(helper.newBlog)
  const blogsAfterPost =await helper.blogsInDb()
  expect(blogsAfterPost).toHaveLength(helper.initialBlog.length+1)
  expect(blogsAfterPost).toContainEqual(expect.objectContaining(helper.newBlog))

})

test('Missing Likes on POST request will default to 0', async() => {
  const newBlognolikes = { ...helper.newBlog }
  delete newBlognolikes.likes

  await (api.post('/api/blogs')).send(newBlognolikes)

  const blogsAfterPost =await helper.blogsInDb()
  const expectedBlog = { ...helper.newBlog,likes:0 }

  expect(blogsAfterPost).toHaveLength(helper.initialBlog.length+1)
  expect(blogsAfterPost).toContainEqual(expect.objectContaining(expectedBlog))

})

test ('title and url properties are missing from the request data return 404', async()=>{
  const modifiedBlog = { ...helper.newBlog }
  delete modifiedBlog.title
  delete modifiedBlog.url

  await (api.post('/api/blogs')).send(modifiedBlog).expect(400)
  const blogsAfterPost = await helper.blogsInDb()
  expect(blogsAfterPost).toHaveLength(helper.initialBlog.length)

})

test('updating the likes on blog',async() => {
  const initalBlogsinDb = await helper.blogsInDb()
  const blogToUpdate = initalBlogsinDb[0]
  await api.put(`/api/blogs/${blogToUpdate.id}`).send({ likes: blogToUpdate.likes+1 }).expect(200)
  const updatedBlog = await api.get(`/api/blogs/${ blogToUpdate.id }`)
  expect(updatedBlog.body.likes).toBe(blogToUpdate.likes+1 )

})

test('deletion of blog',async() => {
  const initalBlogsinDB = await helper.blogsInDb()
  const blogtoDelete = initalBlogsinDB[0]
  await api.delete(`/api/blogs/${blogtoDelete.id}`).expect(204)
  const blogsAfterDelete = await helper.blogsInDb()

  expect( blogsAfterDelete ).toHaveLength(
    helper.initialBlog.length - 1
  )

  expect(blogsAfterDelete).not.toContainEqual(blogtoDelete)

})


afterAll(() => {
  mongoose.connection.close()
})
