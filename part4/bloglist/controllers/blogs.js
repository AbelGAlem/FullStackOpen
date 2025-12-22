const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.status(200).json(blogs)
})

// Create a blog
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  if(!body.title || !body.url){
    return response.status(400).json({ error: 'title or url is missing' })
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author || "Unknown",
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await newBlog.save()
  response.status(201).json(savedBlog)
})

// Update a blog
blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  const id = request.params.id

  await Blog.findByIdAndUpdate(id, { title, author, url, likes }, { new: true }).then(result => {
    if(!result){
      return response.status(404).json({
        errorMessage : 'Could not find blog.'
      })
    }
    response.status(201).json(result)
  }).catch(error => next(error))
})

// Delete a blog
blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id

  await Blog.findByIdAndDelete(id)    
  response.status(204).end()
})

module.exports = blogsRouter