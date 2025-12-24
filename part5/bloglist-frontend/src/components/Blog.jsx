import { useState } from 'react'

const Blog = ({ blog, handleUpdateBlog, handleDeleteBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)
  const [buttonName, setButtonName] = useState('view')

  const toggleVisibility = () => {
    setVisible(!visible)
    setButtonName(visible ? 'view' : 'hide')
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    handleUpdateBlog(updatedBlog)
  }

  const showVisible = { display: visible ? '' : 'none' }
  console.log(currentUser)
  return(
    <div className="blog">
      <label>{blog.title} {blog.author} <button onClick={toggleVisibility}>{buttonName}</button></label>
      <div style={showVisible}>
        <p>{blog.url}</p>
        <div>
          <label>{blog.likes} likes </label>
          <button onClick={handleLike}>like</button>
        </div>
        <p>{blog.user.username}</p>
        <button
          onClick={() => handleDeleteBlog(blog)}
          style={ blog.user.username === currentUser.username ? {} : { display: 'none' } }
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Blog