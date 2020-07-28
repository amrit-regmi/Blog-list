const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const initialBlog = [
  {
    id: 'b1',
    title: 'Test Title 1',
    author:' Test Author 1',
    url: 'http://test1.com',
    likes:1,

  },
  { id: 'b2',
    title: 'Test Title 2',
    author:' Test Author 2',
    url: 'http://test1.com',
    likes:2,
  },

]

const initialUser =
  {
    name: 'Test User 1',
    username: 'test user1',
  }


const newBlog =  {
  title: 'Test Title 3',
  author:' Test Author 3',
  url: 'http://test3.com',
  likes:3,
}

const initialUserAuthToken = async() => {
  const user = await User.findOne({ username:initialUser.username })
  // eslint-disable-next-line no-undef
  return jwt.sign({ username:user.username ,id: user.id, name: user.name },process.env.SECRET)
}

const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())

}


const usersInDb = async() => {
  const users = await User.find({})
  return users.map(user => user.toJSON())

}

module.exports ={
  newBlog, initialBlog,blogsInDb,usersInDb,initialUserAuthToken,initialUser
}