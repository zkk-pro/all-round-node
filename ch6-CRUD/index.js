// 1. 引入mongoose
const mongoose = require('mongoose')

// 2. 使用connect方法 连接MongoDB
// 参数字符串：mongodb://localhost 数据库地址表示本机安装的MongoDB
// 在实际开发中，这个参数应该来自配置文件
// 后面紧跟的是数据库的名称： first_db
mongoose.connect('mongodb://localhost/first_db', {useNewUrlParser: true})
  .then(() => console.log('Connected to MongoDB... '))
  .catch(err => console.log('Could not connect to MongoDB...', err))

const videoSchema = new mongoose.Schema({
  name: String, // 名字，值是字符串
  author: String, // 作者，值是字符串
  tags: [ String ], // 标签，值是字符串数组
  // date: Date,
  date: { type: Date, default: Date.now}, // 时间，有个当前时间默认值
  isPublished: Boolean // 是否上映，布尔值
})

// 参数1：目标集合的单数模型名称，单数是指：videos的单数是：video
// 参数2：这个集合所需的schema
const Video = mongoose.model('video', videoSchema)

// 这个对象可以映射为一个MongoDB的文档
const video = new Video({
  name: 'movie 1',
  author: 'star',
  tags: ['action', 'lovely'],
  isPublished: true
})