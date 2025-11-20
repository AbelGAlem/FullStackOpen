require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require("./models/person")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Get all people
app.get("/api/persons", (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

// Get phonebook information
app.get("/info", (request, response) => {
  Person.countDocuments().then(count => {
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date().toISOString()}</p>
    `)
  })
})

// Get individual person
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id

  Person.findById(id).then(person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).json({
        errorMessage : "Could not find person."
      })
    }
  }).catch(error => next(error))
})

// Create a person
app.post("/api/persons", (request, response, next) => {
  const {name, number} = request.body

  Person.findOne({name}).then(existingPerson => {
    // Check if person already exist 
    if(existingPerson){
      return response.status(400).json({
        errorMessage : "Name already exists."
      })
    }
    if(!name || !number){
      return response.status(400).json({
        errorMessage : "Please add both name and number."
      })
    }

    const person = new Person({
      name: name,
      number: number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    }).catch(error => next(error))
  })
})

// Update a person
app.put("/api/persons/:id", (request, response, next) => {
  const {name, number} = request.body
  const id = request.params.id

  Person.findByIdAndUpdate(id, {number: number}, {new: true}).then(result => {
    if(!result){
      return response.status(404).json({
        errorMessage : "Could not find person."
      })
    }
    response.json(result);
  }).catch(error => next(error))
})

// Delete a person
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})