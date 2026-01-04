import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls addBlog with the right details when submitted', async () => {
    const user = userEvent.setup()
    const addBlog = vi.fn()

    render(<BlogForm addBlog={addBlog} />)

    await user.type(screen.getByPlaceholderText('title'), 'Testing title')
    await user.type(screen.getByPlaceholderText('author'), 'Testing author')
    await user.type(screen.getByPlaceholderText('url'), 'testurl.com')

    await user.click(screen.getByText('create'))

    expect(addBlog.mock.calls).toHaveLength(1)

    expect(addBlog.mock.calls[0][0].title).toBe('Testing title')
    expect(addBlog.mock.calls[0][0].author).toBe('Testing author')
    expect(addBlog.mock.calls[0][0].url).toBe('testurl.com')
  })
})
