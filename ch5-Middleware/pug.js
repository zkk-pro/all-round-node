const express = require('express')
const debug = require('debug')('app:startup')

const app = express()

const PORT = process.env.PORT || 3000

// 当我们这样设置后，Express会在内部自己导入pug包，而不要我们手工导入
app.set('view engine', 'pug')
// 模板的路径，不是必须的，默认是process.cwd()+'/views'，就是当前应用views文件夹
app.set('views', './views') // 默认的

app.get('/', (req, res) => {
  res.render('index', { title: 'My Express App', message: 'Hello Pug'})
})

app.listen(PORT, () => debug(`app running at ${PORT}`))