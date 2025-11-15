const People = ({peoples, onDelete}) => (
    <li className="people">
      {peoples.map((person) => 
        <ul key={person.id}>
          <p> {person.name} {person.number}</p> 
          <button onClick={() => onDelete(person.id)}>delete</button>
        </ul>
      )}
    </li>
  )
export default People  