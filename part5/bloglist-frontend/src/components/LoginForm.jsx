import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const onHandleLogin = (event) => {
    event.preventDefault()
    handleLogin(credentials)
    setCredentials({ username: '', password: '' })
  }
  return(
    <div>
      <h2>Login</h2>
      <form onSubmit={onHandleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}
export default LoginForm