const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'sekret',
  },
]

const initialBlogs = [
  {
    title: 'The begining',
    author: 'Me',
    url: 'String',
    likes: 4
  },
  { 
    title: 'The begining 2',
    author: 'Them',
    url: 'String',
    likes: 6
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialBlogs, blogsInDb, usersInDb, initialUsers
}