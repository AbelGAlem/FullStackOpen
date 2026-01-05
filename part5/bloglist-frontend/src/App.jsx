import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [notification, setNotification] = useState(null)
  const [success, setSuccess] = useState(null)

  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleCreateBlog  = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.createBlog(newBlog)
      //TODO: may not be the best fix , maybe do this on backend
      const blogWithUser = {
        ...response,
        user: {
          ...response.user,
          username: user.username,
          name: user.name,
          id: user.id,
        },
      }
      setBlogs( [...blogs, blogWithUser].sort((a, b) => b.likes - a.likes) )

      handleNotification('Added new blog ' + newBlog.title + ' by ' + newBlog.author, true)
    } catch (e) {
      handleNotification( e.response.data.error || 'Something went wrong', false)
    }
  }

  const handleUpdateBlog = async (updatedBlog) => {
    try{
      await blogService.updateBlog(updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog).sort((a, b) => b.likes - a.likes))
      handleNotification('Updated blog ' + updatedBlog.title + ' by ' + updatedBlog.author, true)
    } catch(e) {
      handleNotification(e.response.data.error || 'Something went wrong', false)
    }
  }

  const handleDeleteBlog = async (blog) => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
      try{
        await blogService.deleteBlog(blog)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        handleNotification('Deleted blog ' + blog.title + ' by ' + blog.author, true)
      } catch(e) {
        handleNotification(e.response.data.error || 'Something went wrong', false)
      }
    }
  }

  const handleLogin = async (credentials) => {
    console.log('hellooo')
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      handleNotification('logged in succesfully', true)
    } catch(e){
      handleNotification( e.response.data.error || 'wrong credentials', false)
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const handleNotification = (message, successStatus) => {
    setSuccess(successStatus)
    setNotification(message)
    setTimeout(() => {setNotification(null), setSuccess(null)}, 4000)
  }

  if(!user) {
    return (
      <div>
        <Notification message={notification} success={success} />
        <LoginForm handleLogin={handleLogin}/>
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification} success={success} />

      <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>Logout</button>
        <br />
        <h1>Create blog</h1>
        <Togglable ref={blogFormRef} buttonLabel="create">
          <BlogForm
            addBlog={handleCreateBlog}
          />
        </Togglable>
      </div>

      <br />
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleUpdateBlog={handleUpdateBlog}
          handleDeleteBlog={handleDeleteBlog}
          currentUser={user}
        />
      )}
    </div>
  )
}

export default App