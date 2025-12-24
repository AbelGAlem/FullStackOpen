const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const listHelper = require('../utils/list_helper')

const blogs = [{
  title: 'The beginign',
  author: 'Me',
  url: 'String',
  likes: 4
}]
const blogs2 = [{
  title: 'The beginign',
  author: 'Me',
  url: 'String',
  likes: 4
},{
  title: 'The beginign',
  author: 'Them',
  url: 'String',
  likes: 6
}]
const blogs3 = [{
  title: 'The beginign',
  author: 'Them',
  url: 'String',
  likes: 4
},{
  title: 'The end',
  author: 'Me',
  url: 'String',
  likes: 6
},{
  title: 'The end',
  author: 'Me',
  url: 'String',
  likes: 6
}]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is 0', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog post', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 4)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(blogs2), 10)
  })
})


describe('Favorite blog', () => {
  test('of empty list is 0', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has only one blog post', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), {
      title: 'The beginign',
      author: 'Me',
      url: 'String',
      likes: 4
    })
  })

  test('of a bigger list is calculated right', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs2), {
      title: 'The beginign',
      author: 'Them',
      url: 'String',
      likes: 6
    })
  })

  test('of a bigger list with same likes', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs3), {
      title: 'The end',
      author: 'Me',
      url: 'String',
      likes: 6
    })
  })
})

describe('Most Blogs', () => {
  test('returns null for empty array', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('returns correct author when there is only one blog', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: 'Me',
      blogs: 1
    })
  })

  test('returns author with most blogs from multiple authors', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogs3), { author: 'Me', blogs: 2 })
  })
})

describe('Most Likes', () => {
  test('returns null for empty array', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('returns correct author when there is only one blog', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), { author: 'Me', likes: 4 })
  })

  test('returns author with most total likes from multiple authors', () => {
    const result = listHelper.mostLikes(blogs2)
    assert.deepStrictEqual(result, { author: 'Them', likes: 6 })
  })
})