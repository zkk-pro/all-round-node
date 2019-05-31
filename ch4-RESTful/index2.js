
// RESTful API
const express = require('express')

const app = express()

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
  let video = videos.find(video => {
    return video.id === parseInt(req.params.id)
  })
  res.send(video)
})

app.listen(port, () => { console.log(`Listening on port ${port}`) })