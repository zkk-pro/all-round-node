// 引用方式

const mongoose = require('mongoose')

// 链接数据库
mongoose.connect('mongodb://localhost/relation', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('Could not connect MongoDB...', err))

// 创建Actor集合
const Actor = mongoose.model('actor', new mongoose.Schema({
  name: String,
  sex: String
}))

// 创建Video集合
const Video = mongoose.model('video', new mongoose.Schema({
  name: String,
  // 指向Actor集合的id引用链接
  actor: {
    type: mongoose.Schema.Types.ObjectId, // 类型
    ref: 'actor' // 指明引用的目标集合
  }
}))

// 创建actor文档
async function createActor(name, sex) {
  const actor = new Actor({
    name,
    sex
  })
  let result = await actor.save()
  console.log(result)
}

// 创建video文档
async function createVideo(name, actor) {
  const video = new Video({
    name,
    actor
  })
  const result = await video.save()
  console.log(result)
}

// 查询video集合
async function listVideo() {
  const videos = await Video
  .find()
  .populate('actor', 'name -_id')
  .select('name actor')
  console.log(videos)
}

// 第一步，创建actor文档
// createActor('wangfei', 'girl')

// 第二步创建电影文档，并把actor文档中的id传入
// createVideo('movie 1', '5d15e879bab1659d12c18d51')

// 查询
listVideo()