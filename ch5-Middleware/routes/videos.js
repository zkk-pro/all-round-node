const express = require('express')
// 之前的操作，但是当我们把路由独立出来后，这样就没用了
// 因为是创建了两个app对象
// const app = express() 

// 在express中，有一个Router方法，这个方法返回Router对象
const router = express.Router()


let videos = [
  {id: 1, name: 'movie1'},
  {id: 2, name: 'movie2'}
]

// 获取所有电影列表
router.get('/api/videos', (req, res) => {
  res.send(videos)
})
// 获取单个电影数据
router.get('/api/videos/:id', (req, res) => {
  let video = videos.find(v => v.id === parseInt(req.params.id))
  // 没有找到，返回404，这是RESTful的惯例
  if (!video) return res.status(404).send('no hava this video')
  res.send(video)
})

// 处理post请求
router.post('/api/videos', (req, res) => {
  // 验证输入
  // if (!req.body.name || req.body.name.length < 3) {
  //   // 返回：400 状态码，表示 Bad Request，是一个错误的请求
  //   res.status(400).send('Name is required and should be minimum 3 characaters')
  //   return
  // } 

  /**
   * 使用joi 验证输入
   * 在使用Joi之前，要先定义一个schema(模式)，schema定义了对象外观的特征
   * 比如对象中应该有什么属性，属性的类型是什么，最小和最大的字符数是多少
   * 有没有包含数字，数字的范围是什么。。。等待
   */
  // 1. 定义一个schema
  const schema = {
    name: Joi.string().min(3).required()
  }

  // 2.把请求数据和 schema 传递给validate方法中验证，返回一个对象
  const result = Joi.validate(req.body, schema)
  // 查看结果，在发起post请求时，试试合法和不合法的参数，然后查看result是什么
  // 如果合法，error 为null，不合法，error的值是具体的错误信息
  console.log(result)
  // { error: null,
  //   value: { name: '123' },
  //   then: [Function: then],
  //   catch: [Function: catch] }

  // 3.判断是否有合法(error不为null表示数据有误)，那么就返回400和错误信息
  if (result.error) return res.status(400).send(result.error.details[0].message)

  let video = {
    id: videos.length + 1, // 因为没有用数据库，所以手工设置id
    name: req.body.name
  }
  videos.push(video)
  // 最后，按照惯例，我们应该返回新创建的数据，有可能客户端需要用到它
  res.send(video)
})

// 更新操作
router.put('/api/videos/:id', (req, res) => {
  // 1. 找到指定id的电影，如果存在，返回404
  let video = videos.find(v => v.id === parseInt(req.params.id))
  if (!video) return res.status(404).send('The video is not found')

  // 2. 验证传递过来的电影对象(数据)，如果不合法，返回400
  const schema = {
    name: Joi.string().min(3).required()
  }
  const { error }= Joi.validate(req.body, schema)

  if (error) return res.status(400).send(error.details[0].message)

  // 3.更新电影数据，返回更新后的电影数据
  video.name = req.body.name
  res.send(video)
})

// 删除操作
router.delete('/api/videos/:id', (req, res) => {
  // 1. 根据参数 id 查找指定的电影，如果不存在返回404
  let video = videos.find(v => v.id === parseInt(req.params.id))
  if (!video) return res.status(404).send('The video is not found')

  // 2.删除指定的电影
  let index = videos.indexOf(video)
  videos.splice(index, 1)

  // 3. 返回删除的电影
  res.send(video)
})

module.exports = router