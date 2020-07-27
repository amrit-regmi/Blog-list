/* eslint-disable no-unused-vars */
const lodash= require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total,blog) => total + blog.likes,0)
}

const favouriteBlog = (blogs) => {
  if(blogs.length === 0) {
    return []
  }

  return blogs.reduce ((fav,blog) => {
    return blog.likes > fav.likes ? blog : fav
  })
}

const mostBlogs = (blogs) => {
  const countPerAuthor = lodash.countBy(blogs,'author')
  const maxKey = lodash.maxBy(lodash.keys(countPerAuthor), o => countPerAuthor[o])
  const maxBlogs = { author:maxKey, blogs:countPerAuthor[maxKey] }

  return maxBlogs

}

const mostLikes = (blogs) => {
  const groupByAuhor = lodash.groupBy(blogs,'author')
  const  likesPerAuthor= lodash.map(groupByAuhor,(v,k) => {
    return { author: k, likes:lodash.reduce(v,(totLikes,item) => totLikes + item.likes,0) }
  })
  const maxLikes = lodash.maxBy(likesPerAuthor,'likes')
  return maxLikes
}
module.exports = {
  dummy,totalLikes,favouriteBlog,mostBlogs,mostLikes
}

