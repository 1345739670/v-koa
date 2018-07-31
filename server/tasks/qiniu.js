
const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')

const bucket = config.qiniu.bucket

// 定义鉴权对象
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
// 构建一个上传用的config对象
const cfg = new qiniu.conf.Config()
// 资源管理相关的操作首先要构建BucketManager对象：
const client = new qiniu.rs.BucketManager(mac, cfg)
// 定义上传async函数
const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    // 抓取网络资源到空间
    client.fetch(url, bucket, key, (err, ret, info) => {
      if (err) {
        reject(err)
      } else {
        if (info.statusCode === 200) {
          resolve({ key })
        } else {
          reject(info)
        }
      }
    })
  })
}

;(async () => {
  let movies = [
    { 
      video: 'http://vt1.doubanio.com/201807301953/aa60dc769131888c9fb2846e6c323034/view/movie/M/402320251.mp4',
      doubanId: '26791910',
      cover: 'https://img3.doubanio.com/img/trailer/medium/2524610105.jpg?',
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2522682953.jpg'
    }
  ]
  movies.map(async movie => {
    if (movie.video && !movie.key) {
      try {
        console.log('开始上传video')
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        console.log('video上传完毕')
        console.log('开始上传cover')
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.jpg')
        console.log('cover上传完毕')
        console.log('开始上传poster')
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')
        console.log('poster上传完毕')
        
        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }
        console.log(movie)
        /*
        [
          { 
            video: 'http://vt1.doubanio.com/201807301953/aa60dc769131888c9fb2846e6c323034/view/movie/M/402320251.mp4',
            doubanId: '26791910',
            cover: 'https://img3.doubanio.com/img/trailer/medium/2524610105.jpg?',
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2522682953.jpg',
            videoKey: 'Yk6mQFEQfzYimZn1uXKDe.mp4',
            coverKey: 'rSQh1Fjz90f9K3_9iaI3C.jpg',
            posterKey: 'eLABxhHogYVGRoD~G_w86.jpg' 
          }
        ]
        */


      } catch (err) { 
        console.log(err)
      }
    }
  })
})()