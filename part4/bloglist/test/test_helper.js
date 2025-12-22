const Blog = require("../models/blog")

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

module.exports = {
  initialBlogs, blogsInDb
}