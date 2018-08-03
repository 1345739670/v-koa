const Koa = require('koa');

const mongoose = require('mongoose')

const { resolve } = require('path');
const { connect,initSchemas } = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['router']

const port = 8536;

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

;(async () => {
  await connect()

  initSchemas()

  // require('./tasks/movie')
  // require('./tasks/api')
  const app = new Koa();
  await useMiddlewares(app)
  app.listen(port);
  console.log(`Server running`);
  
})()



// app.use(async (ctx, next)=>{
//   ctx.body = '电影首页'
// })

// console.log(`Server running at http://127.0.0.1:${port}/`);
