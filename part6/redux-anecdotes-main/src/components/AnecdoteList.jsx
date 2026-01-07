import { useDispatch, useSelector } from "react-redux"
import { addVote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const anecdotes = useSelector(({anecdotes, filter}) => {
    if(filter === '') {
      return [...anecdotes].sort((a, b) => b.votes - a.votes)
    }
    return [...anecdotes]
      .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => b.votes - a.votes)
  })
  
  const dispatch = useDispatch()

  const vote = id => {
    dispatch(addVote(id))
    dispatch(setNotification(`you voted '${anecdotes.find(a => a.id === id).content}'`))
  }
  
  return (
    <>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
