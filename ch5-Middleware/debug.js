const express = require('express')
// require('debug') 返回的是一个函数，我们可以调用这个函数，并给它传参
// 传递的参数是一个用于调试的专用命名空间，例如这里传递：app:startup
const startupDebugger= require('debug')('app:startup')
// 再创建一个数据库的 debug
const dbDebugger = require('debug')('app:db')

const app = express()

const PORT = process.env.PORT || 3000

startupDebugger('app debug...')
// 数据库调试。。。
dbDebugger('db debug...')

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(PORT, () => console.log(`app running at ${PORT}`))