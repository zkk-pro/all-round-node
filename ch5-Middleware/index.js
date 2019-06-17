const express = require('express')
const logger = require('./middleware/logger')
const Helmet = require('helmet')
const Morgan = require('morgan')
const videos = require('./routes/videos')

const app = express()

const PORT = process.env.PORT || 3000

// 自定义中间件
app.use((req, res, next) => {
  console.log('logging...')
  // next 表示下一个中间件的引用
  // 调用next将控制权交给下一个中间件
  // 如果没有调用，那就没有有闭合请求返回闭环，请求将被无限期挂起
  next()
})
app.use(logger)

app.use(express.urlencoded({extended: true}))
// 这里需要提供一个静态内容的文件夹
app.use(express.static('public'))
app.use(Helmet())

// 环境
console.log(`NODE_ENV: ${process.env.NODE_ENV}`) // 未设置返回undefined
console.log(`app.get('env'): ${app.get('env')}`) // 未设置返回development

// 在开发环境中开启日志记录
if (app.get('env') === 'development') {
  // 需要提供字符串参数格式化
  app.use(Morgan('tiny'))
  console.log('Morgan enabled...')
}

app.use('/', videos)

app.get('/', (req, res) => {
  res.send('home')
})
app.post('/', (req, res) => {
  console.log(req.body)
  res.send('home')
})

app.listen(PORT, () => console.log(`app running port at ${PORT}`))