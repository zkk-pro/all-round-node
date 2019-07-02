# 模型关系

在实际的开发中，我们可能不是对单个文档进行操作，例如我们有一个`videos`文档数据，文档里有演员，演员不止一个，so，可能有一个`actors`文档，表示演员集合，文档中的每个演员都有名字、照片等属性，现在来看看如何关联两个文档之间的操作，基本上有2种操作方式

1. 正常操作（范式化）：使用引用

使用这种方式需要一个单独的集合储存演员们`actor`，然后在`video`集合中的`actor`属性写为`actor`集合中的一个文档的`id`，迷了吗？来看代码：

```javascript
// actors 集合
let actor = {
  name: 'wangfei'
}
// videos 集合

let video = {
  actor: 'id' // 这里的id是actors集合中某个文档的 id
  // 设置多个演员方式
  // actor: [
  //   'id1',
  //   'id2',
  //   'id3'
  // ]
}
```

这里需要说明的一点是：在关系型数据库中，”关系“是将数据整合的基本概念，但是在MongoDB或者通用的非关系型数据库中是没有”关系“这一说法的，虽然上面`videos`集合中的`actor`设置了`id`，但是没有任何方式可以建立起两个文档之间的约束，换句话说，可以设置一个非法的id，MongoDB也不会理睬，

2. 非正常操作（反范式化）：使用嵌入文档

第二种方式是，不使用单一的集合，直接将演员文档嵌入到课程中：

```javascript
let video = {
  actor: {
    name: 'wangfei'
  }
}
```

上面的代码就是直接将文档”嵌入“到另一个文档中，两种方式都有各自的优势，选取哪种方式取决于应用的形式和具体的请求，基本上需要在查询性能和一致性之间进行权衡：
- 第一种方式

如果需要修改某个演员的数据，只需修改演员集合，所有引用的演员都会跟着改变，so，第一种方式满足了一致性的要求，但是，每次新建一个电影数据都需要额外再进行演员的查询。

- 第二种方式

查询一次就得到了演员的数据，不需要单独查询演员，因为演员的数据嵌入在课程的文档中了，但是如果需要修改演员的数据，可能就需要修改很多个电影的文档了，而且如果更新的操作没有成功，就可能某些请求会得到旧数据，这样数据就无法保证一致性了。

第一种方式注重一致性，第二种方式注重性能，so，在实际的开中，需要结合实际应用选用哪种方式，两者不可兼得。当然，还有第三种方式：`混合方案`，例如每个演员有50个属性，我们不想在每个电影中重复这些数据，所以我们需要一个单独的作者信息文档，但是不使用id引用，我们可以嵌入部分信息，而不是保留一个完整的引用，比如名字：

```javascript
// actors 集合
let actor = {
  name: 'wangfei',
  // ...其他 50个属性
}
// 电影集合
let video = {
  actor: {
    id: 'ref', // actor集合中某个文档的id
    name: 'wangfei'
  }
}
```

这种方式在查询电影的时候很快得到name属性，但是这样没有在电影文档中完整保留整个actor的信息，使用这种方式在建立某个时间点的数据快照时非常有用，目前我们只是讲解了MongoDB中模型关系的概念，接下来会讲解如何具体操作。

## 一、引用文档方式

现在来看看如何在文档中连接另一个文档，先看代码，在解释：

```javascript
const mongoose = require('mongoose')

// 链接数据库
mongoose.connect('mongodb://localhost/relation', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('Could not connect MongoDB...', err))

// 创建actors集合
const actor = mongoose.model('actor', new mongoose.Schema({
  name: String,
  sex: String
}))

// 创建videos集合
const Video = mongoose.model('video', new mongoose.Schema({
  name: String,
  // 指向actors集合的id引用链接
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
  const videos = await Video.find()
  console.log(videos)
}

// 第一步，创建actor文档
// createActor('wangfei', 'girl')

// 第二步创建video文档，并把actor文档中的id传入
// createVideo('movie 1', '5d15e879bab1659d12c18d51')

// 查询
listVideo()
```

1. 执行`createActor`方法先创建演员

![createActor](https://github.com/zkk-pro/all-round-node/blob/master/assets/createActor.png?raw=true)

2. 执行createVideo，然后属性`actor`的值是上面创建的actor文档的id

![createVideo](https://github.com/zkk-pro/all-round-node/blob/master/assets/createVideo.png?raw=true)

3. 查询video集合，查看数据

### 构建属性（population）

当我们执行上面的第三步查询操作时，得到的actor是`ObjectId`，在现实中我们是想得到actor的名字，这时候，就要用到`populate方法`了，`populate`方法的第一个参数是给定需要构建的属性（也就是需要关联查询的属性），在上面的代码中，设置了`actor`属性引用`actors`集合，在加载Video集合时，mongoose知道要查询MongoDB中的`actors`集合

```javascript
// 查询video集合
async function listVideo() {
  const videos = await Video
  .find()
  .populate('actor')
  .select('name actor')
  console.log(videos)
}
```

打印出来的结果：

![populate](https://github.com/zkk-pro/all-round-node/blob/master/assets/populate.png?raw=true)

可以看到`actor`属性得到了完整的`actor`文档数据，在显示中，可能该文档有很多属性，如果不想全部都提取过来，可以给`populate`方法传递第二个参数，设置想要包含或排除的属性：

```javascript
// 查询video集合
async function listVideo() {
  const videos = await Video
  .find()
  // 只想要name属性，并且排除_id属性
  // 包含：填写属性名，排除：在属性名前面加-
  .populate('actor', 'name -_id')
  .select('name actor')
  console.log(videos)
}
```

![populate_includes](https://github.com/zkk-pro/all-round-node/blob/master/assets/populate_includes.png?raw=true)

可以看到，现在只有actor属性只有name了，同样的，`populate`方法也可以指定多个属性，例如video文档还引用了classify（分类）集合：

```javascript
// 查询video集合
async function listVideo() {
  const videos = await Video
  .find()
  .populate('actor', 'name -_id')
  .populate('classify', 'name')
  .select('name actor')
  console.log(videos)
}
```

### 小结

在本章刚开始的时候，说过MongoDB没有数据库关联性概念，就算actor属性的值是非法的（不存在的）ObjectId，MongoDB也不会报错，当执行查询和构建时，如果是不存在的ObjectId，返回的是null，这点需要尤为注意。

## 嵌入文档

上面讲解了如何使用引用来实现数据关联，现在来看看如何使用嵌入文档的方式，上面使用引用的方式，`actor`的类型设置的是`ObjectId`，并且设置引用`actor`集合。使用嵌入文档的方式，`actor`属性设置的是schema，具体如下代码：

```javascript
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
  // actor属性的值是schema
  actor: actorSchema
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

createVideo('movie 2', new Actor({ name: 'liuyifei' }))
```

执行后的结果：

![embedding](https://github.com/zkk-pro/all-round-node/blob/master/assets/embedding.png?raw=true)

可以看到`actor`属性是一个对象，有id和name，这就是嵌入文档，或者说是一个子文档，这个子文档也可以进行常规文档的操作，比如验证之类的，但是，这个文档不能自行保存，它只能由操作它的父级文档保存，例如更新子文档的name属性：

```javascript
// 更新子文档
// async function updateActor(videoId) {
//   const video = await Video.findById(videoId)
//   video.actor.name = 'new liuyifei'
//   video.save()
}
// 或者直接更新数据
async function updateActor(videoId) {
  const video = await Video.update({ _id: videoId }, {
    $set: {
      'actor.name': 'zkk'
    }
  })
}

updateActor('5d1b15f9b1385005d89f0d10')
```

删除子文档操作

```javascript
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

removeActor('5d1b15f9b1385005d89f0d10')
```

### 子文档数组

现在来看看如何转换为一个子文档数组，

```javascript
// 创建video集合
const Video = mongoose.model('video', new mongoose.Schema({
  name: String,
  actors: [ actorSchema ]
}))

// 子文档数组
async function createSubDocArr(name, actors) {
  const video = new Video({
    name,
    actors
  })
  const result = await video.save()
  console.log(result)
}

// 调用
createSubDocArr('movie 3', [
  new Actor({ name: 'wangfei2'}),
  new Actor({ name: 'wangfei3'})
])
```

结果：

![sub_doc_arr](https://github.com/zkk-pro/all-round-node/blob/master/assets/sub_doc_arr.png?raw=true)

我们也可以之后再添加actor到数组中：

```javascript
// 再次添加子文档
async function addActor(videoId, actor) {
  const video = await Video.findById(videoId)
  video.actors.push(actor)
  video.save()
}

addActor('5d1b318948dc5106a71dbac9', new Actor({ name: 'add actor' }))
```

看一下执行结果：

![add_actor](https://github.com/zkk-pro/all-round-node/blob/master/assets/add_actor.png?raw=true)

可以看到actor从之前的2个变成3个，第三个是后面添加的的。

删除一条数据也很类似，通过子文档的`id方法`找到对应的数据，然后调用子文档的`remove方法`，最后调用父级的`save方法`

```javascript
// 删除一条子文档
async function removeActor(videoId, actorId) {
  const video = await Video.findById(videoId)
  const actor = video.actors.id(actorId)
  actor.remove()
  video.save()
}

removeActor('5d1b318948dc5106a71dbac9', '5d1b340f67a4cd06fa80a338')
```

## 混合模式

混合模式和前面讲的非常相似，是两种模式的结合，具体看代码：

```javascript
// 混合模式
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

async function createHybrid(actorId) {
  const actor = await Actor.findById(actorId)

  let hybrid = new Hybrid({
    name: 'hybrid1',
    actor: {
      _id: actor._id,
      name: actor.name
    }
  })
  hybrid = await hybrid.save()
  console.log(hybrid)
}

createHybrid('5d15e879bab1659d12c18d51')
```

## 总结
本章讲解了mongoose模型关系操作，在现实开发中，更多的是这种三种操作，而不是单个集合的操作，熟练使用这些关系操作和区别很有必要，在应付不同的需求，使用不同的关系操作。

### 欢迎关注我的公众号

![wx_qrcode](https://github.com/zkk-pro/all-round-node/blob/master/assets/wx_qrcode.jpg?raw=true)