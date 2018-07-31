// const url = 'http://api.douban.com/v2/movie/subject/1764796'

const rp = require('request-promise-native')
async function fetchMovie (item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`

  const res = await rp(url)

  return res
}

;(async () => {
  let movie = [
    { doubanId: 27098364,
      title: '超人之死',
      rate: 7.5,
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2526823875.jpg' 
    },
    { doubanId: 26654495,
      title: '亿万少年俱乐部',
      rate: 5.3,
      poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2526881108.jpg'
    }
  ]

  movie.map(async movie => {
    let movieData = await fetchMovie(movie)

    try {
      movieData = JSON.parse(movieData)
      console.log(movieData.tags)
      console.log(movieData.summary)
    } catch (err) {
      console.log(err)
    }

    // console.log(movieData);
    
  })
})()