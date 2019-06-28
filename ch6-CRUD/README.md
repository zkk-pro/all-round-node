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

上面我们创建了一个映射videos文档的对象（video），现在我们就把这个对象数据保存到数据库里，映射videos文档的对象（video）有一个save方法，表示保存到数据里，这是一个异步操作，保存到数据库要花点时间，save方法返回一个Promise，异步保存后的结果是数据库保存的video对象，一旦我们将video对象保存到MongoDB中，MongoDB会给这个对象或文档一个唯一的标识：

```javascript
async function createVideo() {
  // 这个对象可以映射为一个MongoDB的中videos文档
  const video = new Video({
    name: 'movie 1',
    author: 'star',
    tags: ['action', 'lovely'],
    isPublished: true
  })

  // 保存数据到数据库
  const result = await video.save()
  console.log(result)
}

createVideo()
```

这就是MongoDB的美妙之处，不像关系型数据库，我们不需要创建表格、设计表格，我们只需要创建文档，然后存进去就行了， 

### 查询文档

现在让我们看看如何查询MongoDB中的文档，model创建的类有很多查询方法，我们先讲解`find`方法，该方法可以得到一个文档的列表，未查询到返回空数组`[]`，find方法接受一个对象作为参数，表示过滤条件，这个对象可以加入一个或多个键值对用来过滤，还可以进行排序，设置返回文档的数量，也可以选择特定属性的文档，find方法返回一个DocumentQuery对象，所以可以链式调用排序、限制数量...等方法，看代码：

```javascript
const Video = mongoose.model('video', videoSchema)

async function getVideos() {
  // 返回所有文档
  // const videos = await Video.find()

  // 添加过滤条件
  const videos = await Video
    .find({ author: 'star', isPublished: true})
    .limit(10) // 限制最大10条数据
    // 传入一个对象，使用指定的键值对来排序
    // 1 表示升序，-1表示降序
    // .sort({ name: 1 })
      // 另一种用法 name 表示升序 -name表示降序
    .sort('-name')
     // 表示返回指定的属性，1 表示需要返回的属性
    .select({ name: 1, tags: 1})
  console.log(videos)
}
getVideos()
```

**比较查询操作符**

上面我们简单的使用了find方法来筛选文档，接下来我将学习更复杂的查询，在MongoDB有很多的操作符用来做值的比较，MongoDB的操作符在mongoose中同样有效，下面来看看MongoDB中的操作符：

- eq: equal 缩写，表示`等于`
- ne: not equal 缩写，表示`不等于`
- gt: greater than 缩写，表示`大于`
- gte: greater than or equal to 缩写，表示`大于等于`
- lt: less than 缩写，表示`小于`
- lte: less than or equal to 缩写，表示`小于等于`
- in: 包含
- nin: not in 缩写，表示`不包含`

例子：

```javascript
// 获取电影时长大于60分钟的
// 如果是下面这个写法，我们只能获取时长是60分的，无法获取时长大于60分的
// Video.find({ time: 60 })

// so，正确的写法是：
Video.find({ time: {$gt: 60 } })

// 获取时长大于60，小于90分钟的电影
Video.find({ time: {$gt: 60, $lt: 90 } })

// 获取30分钟、60分钟、90分钟的电影
Video.find({ time: {$in: [30, 60, 90] } })
```

**逻辑查询操作符**

- or: 或者
- and: 并且

```javascript
// 这条语句表示作者为 star 并且已经发布的电影
// 如果想要查询 作者为 star 或 已经发布的电影呢
Video.find({ author: 'star', isPublished: true})

// 查询 作者为 star 或 已经发布的电影
Video.find().or([ { author: 'star' }, { isPublished: true} ])

// and 的使用方式和or基本相同，查询结果和第一条find方法一样
// 但有些复杂的查询使用and方法更好用
Video.find().and([ { author: 'star' }, { isPublished: true} ])
```

**使用正则表达式过滤数据**

find方法里的过滤条件匹配的固定的字符串，例如：author: 'star'条件，那么author为star1的是不会返回的，如果想对字符串有更多的控制，这时就需要使用正则表达式了，来看看如何使用：

```javascript
// 匹配author以star开头的数据，后面是什么无所谓
Video.find({ author: /^star/ })

// 匹配author以star结尾的数据，并且忽略大小写
Video.find({ author: /star$/i })

// 匹配author包含star的数据，star可以在前面、中间、后面
Video.find({ author: /.*star.*/ }) // .*表示0个或多个字符

// 还可以使用更复杂的正则表达式，具体的可以去学习正则表达式的使用
```

**计数**

获取符合过滤条件的文档数量

```javascript
Video.find({ author: 'star', isPublished: true}).count()
```

**分页**

之前我们使用`limit`方法，与该方法如影随形的是`skip`方法，我们用它来实现分页功能，来看看如何做：

```javascript
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
```

## 把 json 数据导入数据库

命令为：

```javascript
mongoimport --db mongo-exercises --collection courses --file --jsonArray

```

- mongoimport: MongoDB的导入命令
- --db: 用来指明数据库名
- --collection: 用来指明文档名称
- --file: 导入的那个文件
- --jsonArray: 如果文件数据是json数组，就需要添加这个参数

### 更新文档

前面我们已经学习了很多查询相关的方法了，现在来看看如何更新数据库文档。在MongoDB中有两种更新文档的方式：第一种是先查询，然后编辑，最后保存；另一种方式是先更新，直接接入数据库修改文档，同时可以可选的获取已经更新的文档，先看看第一种方式：

```javascript
async function updateCourse(id) {
  // 1. 通过id找到数据
  const course = await Course.findById(id)
  if (!course) return // 判断

  // 2. 修改数据
  // course.isPublished = true
  // course.author = 'yaya'
  // 另一种修改方式
  course.set({ isPublished: true, author: 'yaya'})

  // 3. 保存数据
  const result = await course.save()
  console.log(result)
}

updateCourse('5a68fdf95db93f6477053ddd')
```

上面第一种方式当你接收到客户端的数据并且向验证数据的时候很有用，例如：如果isPublished为true，表示已经发布，已经发布的电影不能修改作者（author）字段，那么这方式，就需要先查询到数据，然后在判断后，才能进行下一步的操作。但是有时候，如果不需要验证客户端发过来的数据，那么可以使用第二种方式：

```javascript
async function updateCourse2(id) {
  const result = await Course.update({_id: id}, {
    $set: {
      author: 'Hey',
      isPublished: false
    }
  })
  console.log(result)
  // { n: 1, nModified: 1, ok: 1 }
}

updateCourse2('5a68fdf95db93f6477053ddd')
```
update方法第一个参数作为过滤，传入唯一的条件，更新一个数据，传入匹配多条数据的，更新多个数据，第二个参数为更新的数据，这里需要使用一个或多个更新运算符更新运算符可以在MongoDB的官方文档里：`Reference->Operators->Update Operators`里查看返回的结果是实现更新操作的结果，而不是文档。

运算符：
- `$currentDate`: 将字段的值设置为当前日期，可以是Date或Timestamp
- `$inc`: 以特定的值递增，传递负值表示递减
- `$min`: 给定的值小于现有字段值时才更新字段
- `$max`: 和`$min`相反，给定的值大于现有字段值时才更新
- `$mul`: 将字段的值乘以指定的数量
- `$rename`: 重命名字段
- `$set`: 设置文档中字段的值
- `$setOnInsert`: 如果更新导致文档插入，则设置字段的值。 对修改现有文档的更新操作没有影响
- `$unset`: 从文档中删除指定的字段

有时候，我们想要得到已经被修改好的文档，可以使用`findByIdAndUpdate`方法：

```javascript
async function updateCourse3(id) {
  // 第一个参数是id，第二个参数需要更新的数据
  const course = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Hey',
      isPublished: false
    }
  }, { new: true })
  console.log(course)
}

updateCourse3('5a68fdf95db93f6477053ddd')
```

使用`findByIdAndUpdate`得到的就是查询的对象（文档更新之前的），如果需要得到更新之后的文档，添加第三个参数`{ new: true }`。

### 删除文档

最后，我们来看看如何删除数据库的文档，使用`deleteOne`方法，这个方法接受一个过滤器对象，并且如果有多条符合过滤条件的文档，也只删除找到的第一条文档，返回删除的操作结果

```javascript
async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id })
  console.log(result)
  // { n: 1, ok: 1, deletedCount: 1 }
}

removeCourse('5a68fdc3615eda645bc6bdec')
```

如果想一次删除多个文档，可以用`deleteMany`方法，该方法也是返回操作的结果：

```javascript
async function removeCourse(author) {
  const result = await Course.deleteOne({ author: author })
  console.log(result)
}
removeCourse('Hey')
```

如果想得到被删除的文档，可以使用`findByIdAndRemove`方法，如果给定的id不存在，将返回null：

```javascript
// 得到被删除的文档
async function removeCourse(id) {
  const course = await Course.findByIdAndRemove(id)
  console.log(course)
}
removeCourse('5a68fdc3615eda645bc6bdec')
```

### 总结

本篇文档讲解了MongoDB数据库的安装、使用mongoose连接MongoDB数据库和对MongoDB数据库的`增查改删`（CRUD）操作，熟练掌握这些操作是很有必要的，Okey~Thank for your reading!

### 欢迎关注我的公众号

![wx_qrcode](https://github.com/zkk-pro/all-round-node/blob/master/assets/wx_qrcode.jpg?raw=true)