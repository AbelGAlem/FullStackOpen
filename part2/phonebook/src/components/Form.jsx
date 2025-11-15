const Form = ({onSubmit, nameValue, numberValue, setName, setNumber}) => (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={nameValue} onChange={setName} />
        <br />
        number: <input value={numberValue} onChange={setNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
export default Form