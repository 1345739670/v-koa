const mongoose = require('mongoose')
const db = 'mongodb://@localhost:27017/Vuetube'
// mongoose.connect("mongodb://username:password@localhost:27017/dbname", { useNewUrlParser: true })
mongoose.Promise = global.Promise

exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
  
    mongoose.connect(db, { useNewUrlParser: true })
  
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db, { useNewUrlParser: true })
      } else {
        throw new Error('数据库挂了')
      }
    })
  
    mongoose.connection.on('error', err => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db, { useNewUrlParser: true })
      } else {
        // throw new Error('数据库挂了')
        // reject(err)
        console.log(err)
      }
    })
  
    mongoose.connection.once('open', err => {
      resolve()
      console.log('MongoDB Connected scuucessfully');
    })
  })

}