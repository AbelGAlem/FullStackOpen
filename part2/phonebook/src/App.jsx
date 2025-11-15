import { useEffect, useState } from 'react'
import Filter from "./components/Filter"
import Form from "./components/Form"
import People from './components/People'
import { addPerson, getPersons, deletePerson, updatePerson} from './services/personsService'
import Notification from './components/Notifications'

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [notification, setNotification] = useState(null)
  const [success, setSuccess] = useState(null)

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getPersons().then(
      response => {
        setPersons(response)
      }
    )
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.trim().toLowerCase())

    if(existingPerson) {
      const confirmed = window.confirm(`${existingPerson.name} is already added to phonebook, do you want to replace it?`) 
      if(confirmed){
        handleUpdate(existingPerson.id, {...existingPerson, number: newNumber})
        handleNotification(`${newName} was replaced successfully.`, true)
      } 
      return
    }
    addPerson({name: newName, number: newNumber})
        .then(response => {
          setPersons(persons.concat(response))
          setNewName("")
          setNewNumber("")
          handleNotification(`${newName} was added successfully.`, true)
      }).catch(e => {
        handleNotification(`Something went wrong ${e}`, false)
      })
  }

  const handleUpdate = (id, newPerson) => {
    console.log("id in hande", id)
    updatePerson(id, newPerson).then(response => {
      setPersons(persons.map(person => person.id === response.id ? response : person))
      handleNotification(`${newPerson.name} was changed successfully.`, true)
    }).catch(error => {
      handleNotification(`${newPerson.name} is not on server or something went wrong`, false)
      setPersons(persons.filter(n => n.id !== id))
    })
  }

  const handleDelete = id => {
    window.confirm("Are you sure?") &&
      deletePerson(id).then(response => {
        setPersons(persons.filter(person => person.id !== id))
        handleNotification(`Deleted successfully.`, true)
      }).catch((e) => {
        handleNotification(`Something went wrong: ${e}`, false)
      })
  }

  const handleNotification = (message, successStatus) => {
    setSuccess(successStatus)
    setNotification(message)
    setTimeout(() => {setNotification(null), setSuccess(null)}, 4000)
  }

  const shownPeople = filter ? persons.filter((person) => person.name.toLowerCase().includes(filter)) : persons

  return (
    <div>
      <Notification message={notification} success={success} />
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)}/>
      <h2>Add new</h2>
      <Form 
        onSubmit={addName} 
        nameValue={newName} 
        numberValue={newNumber} 
        setName={(e) => setNewName(e.target.value)}
        setNumber={(e) => setNewNumber(e.target.value)}
      />
      <h2>Numbers</h2>
      <People peoples={shownPeople} onDelete={handleDelete} />
    </div>
  )
}

export default App