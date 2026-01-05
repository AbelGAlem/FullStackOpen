const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, viewBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'secret',
      },
    })

    await page.goto('/')
    // this was a tricky issue
    await page.evaluate(() => window.localStorage.clear())
    await page.goto('/')
  })

  test('Login form is shown by default', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'secret')
      await expect(page.getByText('logged in succesfully')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrong')

      await expect(page.getByText('logged in succesfully')).not.toBeVisible()

      await expect(page.getByText('invalid username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'secret')
      await expect(page.getByText('logged in succesfully')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'New blog',
        'Blogger',
        'google.com'
      )

      await expect(page.getByText('New blog Blogger')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const title = 'Likeable blog'
      const author = 'Bob'
      const url = 'google.com'

      await createBlog(page, title, author, url)

      const blog = await viewBlog(page, title, author)

      await expect(blog.getByText('0 likes')).toBeVisible()
      await blog.getByRole('button', { name: 'like' }).click()
      await expect(blog.getByText('1 likes')).toBeVisible()
    })

    test('user who added the blog can delete it', async ({ page }) => {
      const title = 'Deletable blog'
      const author = 'Bob'
      const url = 'google.com'

      await createBlog(page, title, author, url)

      const blog = await viewBlog(page, title, author)

      page.once('dialog', async (dialog) => {
        await dialog.accept()
      })

      await blog.getByRole('button', { name: 'Delete' }).click()

      await expect(page.getByText(`${title} ${author}`)).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          name: 'Other User',
          username: 'otheruser',
          password: 'secret2',
        },
      })

      const title = 'test user blog'
      const author = 'test user'
      const url = 'google.com'

      await createBlog(page, title, author, url)

      // logout 
      await page.getByRole('button', { name: 'Logout' }).click()

      // login as the other user
      await loginWith(page, 'otheruser', 'secret2')
      await expect(page.getByText('Other User logged in')).toBeVisible()

      const blog = await viewBlog(page, title, author)

      await expect(blog.getByRole('button', { name: 'Delete' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await createBlog(page, 'First blog', 'Author A', 'googe.com')
      await createBlog(page, 'Second blog', 'Author B', 'google.com')
      await createBlog(page, 'Third blog', 'Author C', 'google.com')

      const likeBlogTimes = async (title, author, times) => {
        const summary = page.locator('.blog-summary').filter({ hasText: `${title} ${author}` }).first()
        await summary.getByRole('button', { name: 'view' }).click()
        const blog = summary.locator('..')

        for (let i = 0; i < times; i++) {
          const likesText = blog.locator('.likes-count')
          const before = await likesText.textContent()

          await blog.getByRole('button', { name: 'like' }).click()
          await expect(likesText).not.toHaveText(before)
        }

        await blog.getByRole('button', { name: 'hide' }).click()
      }

      await likeBlogTimes('Second blog', 'Author B', 2)
      await likeBlogTimes('First blog', 'Author A', 1)

      const summaries = await page.locator('.blog-summary').allTextContents()

      expect(summaries[0]).toContain('Second blog Author B')
      expect(summaries[1]).toContain('First blog Author A')
      expect(summaries[2]).toContain('Third blog Author C')
    })
  })
})
