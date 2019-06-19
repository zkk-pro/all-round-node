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

async function createVideo() {
  // 这个对象可以映射为一个MongoDB的中videos文档
  const video = new Video({
    name: 'movie 2',
    author: 'star2',
    tags: ['action2', 'love2'],
    isPublished: false
  })

  // 保存数据到数据库
  const result = await video.save()
  console.log(result)
}

// createVideo()

async function getVideos() {
  // Video类有很多查询方法
  // const videos = await Video.find()

  // 添加过滤条件，find方法接受一个对象作为参数
  // 这个对象可以加入一个或多个键值对用来过滤
  const videos = await Video
    .find({ author: 'star', isPublished: true})
    .limit(10) // 限制最大10条数据
    // 传入一个对象，使用指定的键值对来排序
    // 1 表示升序，-1表示降序
    .sort({ name: 1 })
     // 表示返回指定的属性，1 表示需要返回的属性
    .select({ name: 1, tags: 1})


  console.log(videos)
}
// getVideos()

// 分页
async function pagination() {
  // 定义两个变量，通常这个是从前端传递过来的
  let pageNumber = 2 // 第几页
  let pageSize = 10 // 每页多少条数据

  const videos = await Video
    .find({ author: /.*star.*/, isPublished: true })
    // 为了实现分页，我们需要跳过前面的所有文档数据
    // 公式：页数 - 1 * 一页的数据
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize) // 限制每页的数据
    .sort({ name: 1 })
    .select({ name: 1, tags: 1})

  console.log(videos)
}

pagination()