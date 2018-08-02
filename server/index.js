const Koa = require('koa');
const mongoose = require('mongoose');
const { connect,initSchemas } = require('./database/init')
;(async () => {
    await connect()

    initSchemas()

    // require('./tasks/movie')
    require('./tasks/api')
    
})()

const app = new Koa();
app.use(async (ctx, next)=>{
    ctx.body = '电影首页'
})
app.listen(6357);