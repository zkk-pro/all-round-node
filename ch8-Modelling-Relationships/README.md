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
// actor 集合
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

// 创建Actor集合
const Actor = mongoose.model('actor', new mongoose.Schema({
  name: String,
  sex: String
}))

// 创建Video集合
const Video = mongoose.model('video', new mongoose.Schema({
  name: String,
  // 指向Actor集合的id引用链接
  actor: {
    type: mongoose.Schema.Types.ObjectId, // 类型
    ref: 'Actor' // 指明引用的目标集合
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

// 第二步创建电影文档，并把actor文档中的id传入
// createVideo('movie 1', '5d15e879bab1659d12c18d51')

// 查询
listVideo()
```

1. 执行`createActor`方法先创建演员

![createActor](https://github.com/zkk-pro/all-round-node/blob/master/assets/createActor.png?raw=true)

2. 执行createVideo，然后属性`actor`的值是上面创建的actor文档的id

![createVideo](https://github.com/zkk-pro/all-round-node/blob/master/assets/createVideo.png?raw=true)

3. 查询video结合，查看数据