const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-642312222"
  }
]

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toISOString()}</p>
  `)
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id

  const person = persons.find(person => person.id === id)

  if(person){
    response.json(person)
  }else{
    response.status(404).json({
      errorMessage : "Could not find person."
    })
  }
})

app.post("/api/persons", (request, response) => {
  const {name, number} = request.body

  if(!name || !number){
    return response.status(400).json({
      errorMessage : "Please add both name and number."
    })
  }
  if(persons.find(person => person.name === name)){
    return response.status(400).json({
      errorMessage : "Name already exists."
    })
  }

  const person = {
    id: Math.floor(Math.random() * 1000).toString(),
    name: name,
    number: number
  }

  persons = persons.concat(person)
  console.log(persons)
  
  response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id

  const person = persons.find(person => person.id === id)

  if(person){
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  }else{
    response.status(404).json({
      errorMessage : "Could not find person."
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})