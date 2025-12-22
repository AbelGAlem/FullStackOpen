const assert = require('assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require("../app")
const Blog = require("../models/blog")
const helper = require("./test_helper")

const api = supertest(app)

describe('When there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
  
  test('blog posts have id not _id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    for(const blog of response.body){
      assert.strictEqual(blog.id !== undefined, true)
    }
  })

  describe('Addition of a new blog', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'New Blog test',
        author: 'Tester',
        url: 'String',
        likes: 7,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) 
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const blogsAtEnd = response.body

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes(newBlog.title))
    })

    test('if likes is missing, it defaults to 0', async () => {
      const newBlog = {
        title: 'New Blog test',
        author: 'Tester',
        url: 'String',
      }

      const response = await api
        .post('/api/blogs')
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
        .send(newBlog)
        .expect(400)
    })

    test('missing url returns 400', async () => {
      const newBlog = {
        title: 'New Blog test',
        author: 'Tester',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('Delete a blog post', () => {
    test('successfully deletes a blog post', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })
  })

  describe('Update a blog post', () => {
    test('successfully updates a blog post likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 67, // 6... seveennn???
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 67)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
      assert.strictEqual(updatedInDb.likes, blogToUpdate.likes + 67)
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})