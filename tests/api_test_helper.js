const Blog = require('../models/blog')
const initialBlog = [
  {
    title: 'Test Title 1',
    author:' Test Author 1',
    url: 'http://test1.com',
    likes:5
  },
  {
    title: 'Test Title 2',
    author:' Test Author 2',
    url: 'http://test1.com',
    likes:6
  },

]

const newBlog =  {
  title: 'Test Title 3',
  author:' Test Author 3',
  url: 'http://test3.com',
  likes:10
}

const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())

}

module.exports ={
  newBlog, initialBlog,blogsInDb
}