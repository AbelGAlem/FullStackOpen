const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.status(200).json(blogs)
})

// Create a blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if(!body.title || !body.url){
    return response.status(400).json({ error: 'title or url is missing' })
  }

  const user = request.user

  const newBlog = new Blog({
    title: body.title,
    author: body.author || 'Unknown',
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await newBlog.save()

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Update a blog
blogsRouter.put('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blogToChange = await Blog.findById(request.params.id)
  const user = request.user
  // 10 console.logs later, I found the issue
  const newBlog = request.body
  newBlog.user = blogToChange.user

  if (blogToChange.user.toString() === user.id.toString()) {
    await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
    response.status(201).json(newBlog)
  } else {
    response.status(401).json({ error: 'You cannot modify this blog' })
  }
})

// Delete a blog
blogsRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user
  const blogToChange = await Blog.findById(request.params.id)

  if (blogToChange.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'You can not delete blog.' })
  }
})

module.exports = blogsRouter