// const url = 'http://api.douban.com/v2/movie/subject/1764796'
// 通过豆瓣api
const rp = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

async function fetchMovie (item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`
  const res = await rp(url)
  let body

  try {
    body = JSON.parse(res)
  } catch(err) {
    console.log(err)
    
  }
  return body
}

;(async () => {
  // 取出满足以下条件的数据
  let movies = await Movie.find({
    $or: [
      { summary: { $exists: false } },
      { summary: null },
      { year: { $exists: false } },
      { title: '' },
      { summary: '' }
    ]
  })


  // 测试用代码
  // for(let i = 0; i < [movies[0]].length; i++) {
  // 源代码
  for(let i = 0; i < movies.length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)

    if (movieData) {
      let tags = movieData.tags || []

      movie.tags = movie.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []
        movie,year = movieData.attrs.year[0] || 2500
        for (let i = 0; i < movieTypes.length; i++) {
          let item = movie.movieTypes[i]

          // 查找 Category 中是否有
          let cat = await Category.findOne({
            name: item
          })
          
          // 如果 Category 没有该标签名
          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else { // 检查 Category 中是否有该电影的id
            // 如果没有，保存这部电影的id
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }

          await cat.save()
          
          // 检查该电影的标签是否为空
          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            // 如果该电影标签不为空，但是没有这个标签，则添加
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }



        

        let dates = movieData.attrs.pubdate || []
        let pubdates = []

        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'

            if (parts[1]) {
              country = parts[1].split(')')
            }

            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })

        movie.pubdate = pubdates
      }

      tags.forEach(tag => {
        movie.tags.push(tag.name)
      })

      await movie.save()
    }
  }

  console.log('数据导入完毕!')
  

})()