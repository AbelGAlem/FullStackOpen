const assert = require('assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  let token = null

  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sekret',
    }

    await api.post('/api/users').send(newUser).expect(201)

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)

    token = loginResponse.body.token

    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog posts have id not _id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    for (const blog of response.body) {
      assert.strictEqual(blog.id !== undefined, true)
      assert.strictEqual(blog._id === undefined, true)
    }
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added (with token)', async () => {
      const newBlog = {
        title: 'New Blog test',
        author: 'Tester',
        url: 'String',
        likes: 7,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes(newBlog.title))
    })

    test('adding a blog fails with 401 Unauthorized if token is not provided', async () => {
      const newBlog = {
        title: 'No token blog',
        author: 'Tester',
        url: 'no token.com',
        likes: 1,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('if likes is missing, it defaults to 0', async () => {
      const newBlog = {
        title: 'Likes default test',
        author: 'Tester',
        url: 'String',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('missing title returns 400', async () => {
      const newBlog = {
        author: 'Tester',
        url: 'String',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('missing url returns 400', async () => {
      const newBlog = {
        title: 'Missing url test',
        author: 'Tester',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
