const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

;(async () => {
  const script= resolve(__dirname, '../crawler/trailer-list')
  const child = cp.fork(script, [])
  // 调用辨识符
  let invoked = false

  child.on('error', err => {
    if (invoked) return

    invoked = true

    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return

    invoked = false
    let err = code === 0 ? null : new Error('exit code:' + code)

    console.log(err)
  })

  child.on('message', data => {
      let result = data.result

      // console.log(result)
      result.forEach(async item => {
        // 查看数据库中是否有该数据
        let movie = await Movie.findOne({
          doubanId: item.doubanId
        })
        // 如果没有就保存
        if (!movie) {
          movie = new Movie(item)
          await movie.save()
        }
      })
  })
})()