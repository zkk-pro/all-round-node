
// RESTful API
const express = require('express')

const app = express()

app.use(express.json())

const port = process.env.PORT || 3000
let videos = [
  {id: 1, name: 'movie1'},
  {id: 2, name: 'movie2'}
]
// 获取所有电影列表
app.get('/api/videos', (req, res) => {
  res.send(videos)
})
// 获取单个电影数据
app.get('/api/videos/:id', (req, res) => {
  let video = videos.find(v => v.id === parseInt(req.params.id))
  // 没有找到，返回404，这是RESTful的惯例
  if (!video) return res.status(404).send('no hava this video')
  res.send(video)
})

// 处理post请求
app.post('/api/videos', (req, res) => {
  let video = {
    id: videos.length + 1, // 因为没有用数据库，所以手工设置id
    name: req.body.name
  }
  videos.push(video)
  // 最后，按照惯例，我们应该返回新创建的数据，有可能客户端需要用到它
  res.send(video)
})

app.listen(port, () => { console.log(`Listening on port ${port}`) })