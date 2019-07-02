// 使用嵌入的方式关联文档

const mongoose = require('mongoose')

// 链接数据库
mongoose.connect('mongodb://localhost/relation', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('Could not connect MongoDB...', err))

// actor的schema
const actorSchema = new mongoose.Schema({
  name: String,
  sex: String
})

// 创建actor集合
const Actor = mongoose.model('actor', actorSchema)

// 创建video集合
const Video = mongoose.model('video', new mongoose.Schema({
  name: String,
  // actor: actorSchema
  actors: [ actorSchema ]
}))

// 创建video文档
async function createVideo(name, actor) {
  const video = new Video({
    name,
    actor
  })
  const result = await video.save()
  console.log(result)
}

// 更新子文档
// async function updateActor(videoId) {
//   const video = await Video.findById(videoId)
//   video.actor.name = 'new liuyifei'
//   video.save()
// }

// 或者直接更新数据
async function updateActor(videoId) {
  const video = await Video.update({ _id: videoId }, {
    $set: {
      'actor.name': 'zkk'
    }
  })
  console.log(video)
}

// 删除子文档
async function removeActor (videoId) {
  const video = await Video.update({ _id: videoId }, {
    // 删除actor的属性
    $unset: {
      'actor.name': ''
    }
    // 删除整个actor
    // $unset: {
    //   'actor': ''
    // }
  })
}

// 子文档数组
async function createSubDocArr(name, actors) {
  const video = new Video({
    name,
    actors
  })
  const result = await video.save()
  console.log(result)
}

// 再次添加子文档
async function addActor(videoId, actor) {
  const video = await Video.findById(videoId)
  video.actors.push(actor)
  video.save()
}

// 删除一条子文档
async function removeActor(videoId, actorId) {
  const video = await Video.findById(videoId)
  const actor = video.actors.id(actorId)
  actor.remove()
  video.save()
}

// createVideo('movie 2', new Actor({ name: 'liuyifei' }))

// updateActor('5d1b15f9b1385005d89f0d10')

// removeActor('5d1b15f9b1385005d89f0d10')

// createSubDocArr('movie 3', [
//   new Actor({ name: 'wangfei2'}),
//   new Actor({ name: 'wangfei3'})
// ])

// addActor('5d1b318948dc5106a71dbac9', new Actor({ name: 'add actor' }))

removeActor('5d1b318948dc5106a71dbac9', '5d1b340f67a4cd06fa80a338')