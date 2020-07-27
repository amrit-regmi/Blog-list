const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const initialBlog = [
  {
    title: 'Test Title 1',
    url: 'http://test1.com',
    likes:5
  },
  {
    title: 'Test Title 2',
    url: 'http://test1.com',
    likes:6
  },

]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blog = new Blog(initialBlog[0])
  await blog.save()

  blog = new Blog(initialBlog[1])
  await blog.save()
})

const api = supertest(app)

test('correct amount of blog post returned on GET /api/blogs ',async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlog.length)
})

test('unique identifer property is named id', async() => {
  const response = await api.get('/api/blogs')
  expect(response.body[0]['id']).toBeDefined()

})


test('POST to api/blogs creates new blog post', async() => {
  const newBlog =  {
    title: 'Test Title 3',
    url: 'http://test3.com',
    likes:10
  }

  await api.post('/api/blogs').send(newBlog)
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlog.length+1)
  expect(response.body).toContainEqual(expect.objectContaining(newBlog))

})

test('Missing Likes on POST request will default to 0', async() => {
  const newBlog = {
    title: 'Test Title 4',
    url: 'http://test4.com'
  }

  await (api.post('/api/blogs')).send(newBlog)
  const response = await api.get('/api/blogs')
  const expectedBlog = { ...newBlog,likes:0 }
  expect(response.body).toHaveLength(initialBlog.length+1)
  expect(response.body).toContainEqual(expect.objectContaining(expectedBlog))

})

test ('title and url properties are missing from the request data return 404', async()=>{
  const newBlog = {
    likes: 9
  }

  await (api.post('/api/blogs')).send(newBlog).expect(400)
  const response =await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlog.length)

})


afterAll(() => {
  mongoose.connection.close()
})
