const Koa = require('koa');
const { connect,initSchemas } = require('./database/init')
const router = require('./router')
const port = 9876;
;(async () => {
    await connect()

    initSchemas()

    // require('./tasks/movie')
    // require('./tasks/api')
    
})()

const app = new Koa();

app
    .use(router.routes())
    .use(router.allowedMethods())

app.use(async (ctx, next)=>{
    ctx.body = '电影首页'
})
app.listen(port);

// console.log(`Server running at http://127.0.0.1:${port}/`);
