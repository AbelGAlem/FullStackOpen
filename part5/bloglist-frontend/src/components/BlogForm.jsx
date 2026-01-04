import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleCreateBlog = (event) => {
    event.preventDefault()
    addBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return(
    <form onSubmit={handleCreateBlog}>
      <div>
        <label>
          title
          <input
            type="text"
            placeholder="title"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          author
          <input
            type="text"
            placeholder="author"
            value={newBlog.author}
            onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          url
          <input
            type="text"
            placeholder="url"
            value={newBlog.url}
            onChange={(e) => setNewBlog({ ...newBlog, url: e.target.value })}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}
export default BlogForm