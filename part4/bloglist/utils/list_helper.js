const _ = require('lodash')

const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  const sum = blogs.reduce((total, blog) => {
    return total + blog.likes
  }, 0)
  return sum
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }
  return blogs.reduce((favorite, current) => {
    return current.likes > favorite.likes ? current : favorite
  })
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return null
  
  const blogCounts = _.countBy(blogs, 'author')
  const [author, blogsCount] = _.maxBy(
    Object.entries(blogCounts), 
    // eslint-disable-next-line no-unused-vars
    ([author, count]) => count
  )
  return { author: author, blogs: blogsCount }
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return null
  
  const groupedByAuthor = _.groupBy(blogs, 'author')
  
  const authorTotals = _.map(groupedByAuthor, (blogs, author) => {
    const totalLikes = _.sumBy(blogs, 'likes')
    return { author: author, likes: totalLikes }
  })
  
  return _.maxBy(authorTotals, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }