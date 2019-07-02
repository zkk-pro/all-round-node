// 混合方式

const mongoose = require('mongoose')

// 链接数据库
mongoose.connect('mongodb://localhost/relation', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('Could not connect MongoDB...', err))

// actor schema
const actorSchema = new mongoose.Schema({
  name: String,
  sex: String
})
// 创建Actor集合
const Actor = mongoose.model('actor', actorSchema)

// 创建Video集合
const Hybrid = mongoose.model('hybrid', new mongoose.Schema({
  name: String,
  // 混合模式
  actor: {
    type: actorSchema, // 类型
    required: true
  }
}))

// 创建hybrid
async function createHybrid(actorId) {
  const actor = await Actor.findById(actorId)

  let hybrid = new Hybrid({
    name: 'hybrid1',
    // 混合模式
    actor: {
      _id: actor._id,
      name: actor.name
    }
  })
  hybrid = await hybrid.save()
  console.log(hybrid)
}

createHybrid('5d15e879bab1659d12c18d51')