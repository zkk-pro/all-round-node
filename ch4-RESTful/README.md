[TOC]

# RESTful 服务

## 什么是 RESTful❓
RESTful：状态表征转移（Representational State Transfer），也称为RESTful API，在现在web应用中，大多数都采用BS架构（Browser Server），应用的本身就是客户端（前端部分），在底层它需要与服务器对话获取数据，这个对话是在HTTP协议下进行的，HTTP是用于支撑web技术的协议，服务器通过HTTP协议提供各种开放的功能服务，客户端通过发送HTTP请求来获取这些服务。本质上讲，REST就是用来创建这些规范的HTTP服务的，所以，我们使用简单的HTTP协议原则，提供数据的增(Create)查(Read)改(Update)删(delete)服务，我们把这些操作统称为`CRUD`操作。
服务的暴露出一个接口，如：`https:www.zkk-pro.com/api/videos`，客户端通过HTTP不同的方法(或叫动作)对应着要进行的操作，如：get表示获取数据；post添加/发布数据；put修改数据；delete表示删除数据。

## 使用 Express 创建HTTP服务

我们可以使用node自带的HTTP模块创建HTTP服务，但是显然是非常底层的，我们要对不同的请求进行不同的操作，所以需要写很多if代码块来进行判断，当项目复杂时，就会显得难以维护，这时，框架就要登场了，框架给我们一个优秀的结构，可以让项目保持良好的维护性，node的web框架有很多，我们选用Express，它是最受欢迎的，我们可以使用npm安装它：

```javascript
npm i express
```

### 创建第一个web服务

```javascript
// index.js
const express = require('express') // 引入express，返回一个函数

const app = express() // 执行函数，返回一个Express对象

/**
 * express方法返回的对象有很多方法，例如：
 * app.get()
 * app.post()
 * app.put()
 * app.delete()
 * ...
 * 这些都对应这HTTP的方法（get、post、put、delete...）
 */

app.get('/', (req, res) => {
  res.send('Hello, express!')
})

app.listen(3000, () => {console.log('app runing port 3000')})
```
对象`app`的请求处理方法接收两个参数，第一个是路径（URL）,`/`代表站点的根目录；第二个是回调函数（也叫路由句柄），当我们应用接受到对应的请求并匹配对应的路径时，调用的方法。回调函数有两个参数，分别是`request`代表请求对象，`response`响应对象，这两个对象有很多属性，`request`对象的属性可以让我们了解请求的信息，可以先在官方文档里查看`request`对象的API。最后就是使用`app.listen`方法监听指定的端口。使用`node index.js`启动应用，在浏览器中输入`localhost:3000`进行访问。

## Node 监视器
每一次修改node程序代码，我们都要手工重新运行，有更好的方法，我们安装一个node包叫`nodemon`(node monitor)的缩写，使用全局安装方式安装：

```javascript
npm i -g nodemon
```

安装后，以后运行程序就是用`nodemon index.js`，启动后，nodemon会监测该文件夹所有文件、文件名、文件拓展名的改动，在代码修改保存后，nodemon会自动重启运行应用，这样每次修改就不用手工重启了。

## 环境变量
上面我们写的web服务器监听的服务端口3000是写死的，在开发环境还行，但是在生产环境可能就不灵了，因为当我们把应用发布到一个共享平台时，应用可用的端口是由平台动态分配的，所以不能确定我们写的3000是否一定有用，优化这个问题的做法是使用`环境变量`，一般的，在环境变量中管理端口的属性是`PORT`，环境变量就是在进程运行时才产生的变量，它是在应用之外设置的变量，在node中，需要读取环境变量的PORT属性，so，为了读取PORT属性，我们需要使用`process对象`。`process`是node中的全局对象，该对象下有个属性是`env`，该属性可以获取系统设置的所有环境变量，所以我们可以使用`process.env.PORT`来指定应用的端口：

```javascript
// 如果系统指定了PORT，就用系统的指定的端口，如果没有就用3000端口
const port = process.env.PORT || 3000
// 所以上面的应用监听改为
app.listen(port, () => {console.log(`app runing port ${port}`)})
```

### 设置环境变量
- 在Mac中：
```javascript
export PORT=5000
```
- 在windows中：
```javascript
set PORT=5000
```

**小结**

这就是node应用中正确设置端口的方法，需要先尝试读取环境变量的值，如果有，就用环境变量里的值，没有就用设置的端口。

## 在 Express 中处理请求

这一小节我们讲解在Express中处理get、post、put、delete请求，我们可以使用`Postman`来测试我们创建的服务，`Postman`使用简单，可以自行在网上搜索。

### 处理get请求和获取参数

我们以电影为例，首先创建一个RESTful服务，获取所有电影列表（暂时不涉及数据库操作，数据保存在内存中，后面再讲数据库）：

```javascript
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

app.listen(port, () => { console.log(`Listening on port ${port}`) })
```
**获取路由参数**

如果需要获取单个电影数据，就需要在url中包含电影的id，所以，如果想获取`id为1`的电影，url应该是这样的：`/api/videos/1`。1是电影的id，我们的应用中就应该这样写：

```javascript
// :id表示参数，id是参数名，也可以叫别的名字
// 也可以指定多个参数，例如：/api/videos/:year/:month/:day
app.get(`/api/videos/:id`, (req, res) => {
  // req.params.id 获取路由参数（String类型）
  // 从电影列表中查找到指定单个电影
  let video = videos.find(v => v.id === parseInt(req.params.id))
  // 没有找到，返回404，这是RESTful的惯例
  if (!video) return res.status(404).send('no hava this video')
  res.send(video) // 返回指定的单个电影数据
})
```

**获取查询字符串**

使用查询字符串向后端服务传递额外的参数，例如url为：`https//www.zkk-pro/api/videos/1?name=movie1`，表示获取id为1的电影数据，并且电影名字叫movie1的，我们用参数提供路由必要的值，使用查询字符串传递额外的内容，获取查询字符串的方法是：

```javascript
app.get(`/api/videos/:id`, (req, res) => {
  res.send(req.query) // 获取查询字符串
})
```

### 处理post请求
前面我们讲了处理HTTP的get请求，我们用get处理了获取所有数据和单一数据的请求，现在让我们来看看如何处理post请求，我们使用post请求来创建新数据。具体步骤如下：

1. 首先需要读取request的请求体的数据，用请求体的数据创建一条数据；
2. 然后添加到所有数据中。

> 要读取请求体中的数据，需要打开Express获取请求体中JSON对象的功能（这个功能默认是关闭的）

主要代码如下：

```javascript
app.use(express.json()) // 开启Express读取请求体JSON数据功能

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
```

`app.use(express.json())`看起来有点陌生，没关系，我们会在后面的`中间件章节`中讲解，当我们调用`express.json()`这个方法时，返回一个中间件，然后使用`app.use`方法在处理请求流程中使用这个中间件。编写完成后，我们可以在Chrome中添加`Postman`这个插件来请求我们的post接口：

![post_postman](https://github.com/zkk-pro/all-round-node/blob/master/assets/post_postman.jpg?raw=true)

### 数据验证
从安全角度考虑，永远不要相信客户端发给你的东西，记住永远要验证输入的内容，所以上面的post请求，我们应该增加验证：

```javascript
// 验证输入
// 处理post请求
app.post('/api/videos', (req, res) => {
  // 验证输入
  if (!req.body.name || req.body.name.length < 3) {
    // 返回：400 状态码，表示 Bad Request，是一个错误的请求
    res.status(400).send('Name is required and should be minimum 3 characaters')
    return
  } 
  let video = {
    id: videos.length + 1, // 因为没有用数据库，所以手工设置id
    name: req.body.name
  }
  videos.push(video)
  // 最后，按照惯例，我们应该返回新创建的数据，有可能客户端需要用到它
  res.send(video)
})
```

在现实开发中，面对复杂的应用，很可能代码比这个复杂的多，如果你不想在最开始的时候就手写这么复杂输入验证逻辑，有一个可以轻松验证输入的包：`joi`，让我们看看如何使用`joi`：

- 安装joi库

```javascript
npm i joi
```
- 使用joi库

在使用Joi之前，要先定义一个schema(模式)，schema定义了对象外观的特征，比如对象中应该有什么属性，属性的类型是什么，最小和最大的字符数是多少，有没有包含数字，数字的范围是什么。。。等等，具体操作看下面代码：

```javascript
const Joi = require('joi') // 引入joi库
// 处理post请求
app.post('/api/videos', (req, res) => {
  // 使用joi 验证输入
  // 1. 定义一个schema
  const schema = {
    // 表示：有一个name属性，类型为字符串，最小长度为3，是必须的
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

  // 添加数据
  let video = {
    id: videos.length + 1, // 因为没有用数据库，所以手工设置id
    name: req.body.name
  }
  videos.push(video)
  // 最后，按照惯例，我们应该返回新创建的数据，有可能客户端需要用到它
  res.send(video)
})
```

**小结**
对于客户端发过来的数据，一定要进行验证，使用`joi`库可以简单且直观的进行验证，`joi`还提供了很多其它验证功能，具体的可以在使用到的时候查看官方GitHub。

### 处理put请求

要对已有数据进行更改，应当使用`put请求`进行更新数据，下面让我们看看如何使用`put`请求更新数据：

```javascript
app.put('/api/videos/:id', (req, res) => {
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
```

### 处理delete请求

到目前为止，我们实现了增、查和改操作，接下来我们看看删除操作，它跟之前的操作非常相似，具体代码如下：

```javascript
// 删除操作
app.delete('/api/videos/:id', (req, res) => {
  // 1. 根据参数 id 查找指定的电影，如果不存在返回404
  let video = videos.find(v => v.id === parseInt(req.params.id))
  if (!video) return res.status(404).send('The video is not found')

  // 2.删除指定的电影
  let index = videos.indexOf(video)
  videos.splice(index, 1)

  // 3. 返回删除的电影
  res.send(video)
})
```

## 总结

在本章节中，我们主要讲解了什么是RESTful API，并且使用 Express 处理 CRUD 请求，后面我们还会涉及数据库的操作，会越来越全面哦！感谢阅读，希望本篇文章能让你收获知识O(∩_∩)O~~

### 欢迎我的公众号

![wx_qrcode](https://github.com/zkk-pro/all-round-node/blob/master/assets/wx_qrcode.jpg?raw=true)