const cp = require('child_process')
const { resolve } = require('path')

;(async () => {
  const script= resolve(__dirname, '../crawler/video')
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
      // https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2522682953.jpg

      console.log(data)
  })
})()