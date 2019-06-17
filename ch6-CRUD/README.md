# 数据库CRUD（增查改删）

之前在RESTful文章中，我们将数据保存在内存之中，在实际的开发中并不是这样的，因为一旦应用重启，我们就会丢失所有内存的数据，这就是保存数据再数据库的理由，在Express中，有很多可以使用的数据库，具体参考Express指南中数据库集成：`http://www.expressjs.com.cn/guide/database-integration.html#sqlite`。本篇文章我们讲解`MongoDB`，因为它是非常常见的数据库管理系统，它在node和Express中非常常用。
MongoDB是一个文件型（非关系型）数据库，和传统的关系型数据有所不同，在MongoDB中没有表、视图、记录、列等概念，不同于关系型数据库需要先设计数据库，在MongoDB中是没有设计或者结构的，它就是简单在MongoDB中保存JSON对象，这就意味着从MongoDB中读取出来的数据中间不需要经过转换就可以传递给客户端，这就是MongoDB，接下来看看如何安装MongoDB。

### 在Mac上安装MongoDB

在Mac中，推荐使用`homebrew`安装，homebrew 是一个macOS的包管理工具，类似于npm，如果你的电脑上没有安装`homebrew`，访问：`https://brew.sh`查看如何安装，很简单。然后就是使用homebrew 一键安装MongoDB了：

```javascript
brew install mongodb
```

安装完成后，需要创建一个文件家来保存数据库，默认情况下MongoDB在`/data/db`下保存数据，so，创建这个目录：

```javascript
sudo mkdir -p /data/db
// 查看是否拥有读写权限
sudo chown -R `id -un` /data/db
```

运行MongoDB命令：`mongod`（MongoDB damen缩写），这是一个在后台运行的服务，负责监听给定端口的请求：

![mongod](https://github.com/zkk-pro/all-round-node/blob/master/assets/mongod.png?raw=true)

可以看到现在MongoDB在监听27017端口。

### 使用客户端连接数据库

在MongoDB官网（`https://www.mongodb.com`）中下载客户端连接数据库（或者选择你喜欢的MongoDB客户端），点击右上角`Try Free`，再点击Tools，选择`Compass`，然后选择`community Edition Stable`（社区稳定版，免费的）

![mongodb_client](https://github.com/zkk-pro/all-round-node/blob/master/assets/mongodb_client.png?raw=true)

MongoDB Compass 是连接到数据库的工具，可以通过可视化的方式查看数据库、编辑数据。

### 在Windows上安装MongoDB

下载MongoDB：

![mongodb_windows](https://github.com/zkk-pro/all-round-node/blob/master/assets/mongodb_windows.png?raw=true)

下载完安装的时候，左下角看看是否有一个`install MongoDB Compass`选项，这是安装MongoDB Compass可视化工具的选项（以前的版本有这个勾选，现在不知道有没有，因为没有Windows系统，我这里没有去测试），可以不选择，后面自己安装，和上面的Mac下载是一样的，只不过在`Platforms`选项中选择好Windows系统的`MSI`安装包就可以。
安装完MongoDB后，需要把安装目录下的`bin`目录添加到环境变量中的path中（若不明白，可以网上搜索一下），然后在`c:`下创建目录`\data\db`（数据库的默认目录），命令为：`md c:\data\db`，最后输入命令：`mongod`启动MongoDB。

## 连接MongoDB

在应用中连接MongoDB，首先我们安装一个新的包`mongoose`，mongoose 是一个用于连接MongoDB的简单API。

```javascript
npm i mongoose
```

连接数据库

```javascript
// 1. 引入mongoose
const mongoose = require('mongoose')

// 2. 使用connect方法 连接MongoDB
mongoose.connect('mongodb://localhost/first_db', {useNewUrlParser: true})
  .then(() => console.log('Connected to MongoDB... '))
  .catch(err => console.log('Could not connect to MongoDB...', err))
```

- 在实际开发中，connect的参数应该来自配置文件
- mongodb://localhost: 数据库地址 表示本机安装的MongoDB
- first_db: 表示数据库的名称，如果之前没有创建过改数据库，不用担心，只要第一次向这个数据库写入数据，MongoDB就会自动创建它
- 然后运行 node index.js 看看是否连接成功

### 文档结构（Schema）

使用Schema来创建一种MongoDB数据库集合的结构，MongoDB中的集合就像是关系型数据库中的表，文档就类似于关系型数据库中的列，在关系型数据库中有表、列；在MongoDB中有集合、文档。在mongoose中有一个Schema的概念，这个是mongoose的概念，不是MongoDB的概念，我们使用mongoose来设计符合MongoDB集合的`文档结构`，Schema定义文档中应该有什么属性，okey!现在来看看如何创建schema：

```javascript
const videoSchema = new mongoose.Schema({
  name: String, // 名字，值是字符串
  author: String, // 作者，值是字符串
  tags: [ String ], // 标签，值是字符串数组
  // date: Date,
  date: { type: Date, default: Date.now}, // 时间，有个当前时间默认值
  isPublished: Boolean // 是否上映，布尔值
})
```

这就是创建一个schema的方式，在创建schema时，有以下几种类型的格式：
- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array

### 模型（Models）

在上面，我们使用schema创建了文档的结构，现在我们需要将它弄成一个模型，什么是模型？类似于面向对象，有一个类，通过类创建对象，然后我们就可以把对象保存在对应的文档中，为了创建一个类，我们需要把schema变成model，然后model返回一个类，通过该类创建一个对象，这个对象可以映射为MongoDB的文档，具体看下面代码：

```javascript
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
```

### 保存一个文档



