import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import Togglable from './Togglable'

describe('<Blog />', () => {
  const blog = {
    title: 'Blog for testing',
    author: 'test',
    url: 'www.blog.test.cl',
    likes: 2,
    user: { username: 'tester' },
  }

  const currentUser = { username: 'tester' }

  const updateLikes = vi.fn()
  const removeBlog = vi.fn()

  let container

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        handleUpdateBlog={updateLikes}
        handleDeleteBlog={removeBlog}
      />
    ).container
  })

  test('title and author are shown, url and likes are hidden by default', () => {
    //screen.debug()
    const summaryDiv = container.querySelector('.blog-summary')
    const detailsDiv = container.querySelector('.blog-details')

    expect(summaryDiv).toHaveTextContent(`${blog.title} ${blog.author}`)
    expect(detailsDiv).not.toBeVisible()
  })

  test('url and likes are shown after clicking view', async () => {
    const user = userEvent.setup()

    await user.click(screen.getByText('view'))

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(`${blog.likes} likes`)).toBeVisible()
  })

  test('clicking like twice calls handleUpdateBlog twice', async () => {
    const user = userEvent.setup()

    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateLikes.mock.calls).toHaveLength(2)
  })
})



// test('renders content', () => {
//   const blog = {
//     title: 'Test Blog',
//     author: 'Test Author',
//     url: 'http://example.com',
//     likes: 5,
//     user: { username: 'testuser' }
//   }

//   render(<Blog blog={blog} currentUser={{ username: 'testuser' }} />)

//   //screen.debug()

//   const element = screen.getByText('Test Blog Test Author')
//   expect(element).toBeDefined()
// })

// test('clicking the button calls event handler once', async () => {
//   const blog = {
//     title: 'Test Blog',
//     author: 'Test Author',
//     url: 'http://example.com',
//     likes: 5,
//     user: { username: 'testuser' }
//   }
  
//   const mockHandler = vi.fn()

//   render(
//     <Blog blog={blog} handleUpdateBlog={mockHandler} currentUser={{ username: 'testuser' }} />
//   )

//   const user = userEvent.setup()
//   const button = screen.getByText('like')

//   screen.debug(button)

//   await user.click(button)

//   expect(mockHandler.mock.calls).toHaveLength(1)
// })

// describe('<Togglable />', () => {
//   beforeEach(() => {
//     render(
//       <Togglable buttonLabel="show...">
//         <div>togglable content</div>
//       </Togglable>
//     )
//   })

//   test('renders its children', () => {
//     screen.getByText('togglable content')
//   })

//   test('at start the children are not displayed', () => {
//     const element = screen.getByText('togglable content')
//     expect(element).not.toBeVisible()
//   })

//   test('after clicking the button, children are displayed', async () => {
//     const user = userEvent.setup()
//     const button = screen.getByText('show...')
//     await user.click(button)

//     const element = screen.getByText('togglable content')
//     expect(element).toBeVisible()
//   })

//   test('toggled content can be closed', async () => {
//     const user = userEvent.setup()
//     const button = screen.getByText('show...')
//     await user.click(button)

//     const closeButton = screen.getByText('cancel')
//     await user.click(closeButton)

//     const element = screen.getByText('togglable content')
//     expect(element).not.toBeVisible()
//   })

//   test('toggled content can be closed', async () => {
//     const user = userEvent.setup()
//     const button = screen.getByText('show...')
//     await user.click(button)

//     const closeButton = screen.getByText('cancel')
//     await user.click(closeButton)

//     const element = screen.getByText('togglable content')
//     expect(element).not.toBeVisible()
//   })
// })
