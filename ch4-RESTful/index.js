const express = require('express') // 引入express，返回一个函数

const app = express() // 执行函数，返回一个Express对象
/**
 * express方法返回的对象有很多方法，例如：
 * app.get()
 * app.post()
 * app.put()
 * app.delete()
 * ...
 * 这些都对应这HTTP的方法（get、post、put、delete...）
 */

app.get('/', (req, res) => {
  res.send('Hello, express!!!')
})
const port = process.env.PORT || 3000
app.listen(port, () => {console.log(`app runing port ${port}`)})