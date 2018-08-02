const Koa = require('koa');
const mongoose = require('mongoose');
const { connect,initSchemas } = require('./database/init')
;(async () => {
    await connect()

    initSchemas()

    const Movie = mongoose.model('Movie')

    const movies = await Movie.find({})

    console.log(movies)
    
})()

const app = new Koa();
app.use(async (ctx, next)=>{
    ctx.body = '电影首页'
})
app.listen(4545);