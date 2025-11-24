const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Get all blogs
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blog => {
    response.json(blog)
  })
})

// Create a blog
blogsRouter.post('/', (request, response, next) => {
  console.log(request.body)
  const blog = new Blog(request.body)
  console.log(blog)

  blog.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

// Update a person
// blogsRouter.put('/:id', (request, response, next) => {
//   const { name, number } = request.body
//   const id = request.params.id

//   Person.findByIdAndUpdate(id, { name: name, number: number }, { new: true }).then(result => {
//     if(!result){
//       return response.status(404).json({
//         errorMessage : 'Could not find person.'
//       })
//     }
//     response.json(result)
//   }).catch(error => next(error))
// })

// // Delete a person
// blogsRouter.delete('/:id', (request, response, next) => {
//   const id = request.params.id

//   Person.findByIdAndDelete(id).then(() => {
//     response.status(204).end()
//   }).catch(error => next(error))
// })

module.exports = blogsRouter