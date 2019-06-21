# 数据验证

在上篇文章中，我们创建的`schema`都是可选的，所以就算我们把一个空的对象保存到数据库也是可以通过验证的，这显然是不合理的，本章我们来看看如何进行验证。

## require验证器

```javascript
// 数据库连接省略...

const courseSchema = new mongoose.Schema({
  name: {type: String, required: true},
  author: String,
  tags: [String],
  date: { type: String, default: Date.now },
  isPublished: Boolean, 
  price: Number
})

const Course = mongoose.model('course', courseSchema)

async function creteCourse() {
  const course = new Course({
    // name: 'Node.js',
    author: 'Hey',
    tags: ['test'],
    isPublished: true,
    price: 888
  })
  try {
    const result = await course.save()
    console.log(result)
  } catch (err) {
    console.log(err.message)
  }
}
creteCourse()
```

当我们运行代码时，会报错，因为字段`name`是必填的，所以验证失败，数控是不允许写入的，验证机制在我们试图保存数据之前就会介入。

> 需要明白的是：MongoDB没有数据库级别的验证，也就是说MongoDB数据库不会对数据进行验证，不像MySQL一样，在创建表的时候，可以标记某个字段的值是必须的，如果没有该字段或字段没有值，MySQL就不会写入，在MongoDB数据库中就没有这回事，它不关心这些事务，我们上面写的require验证只是在mongoose里面才有用，当我们尝试写入数据库，mongoose做验证，验证不通过就不会向数据库写入。

在之前的文章中，我们讲过`joi`库进行数据验证，joi和mongoose都可以用来做数据验证，我们可以使用joi做前锋，尽早验证客户端的数据是否合法，mongoose是在写入数据库前验证数据是否合法。

## mongoose内建验证器

上面我们讲了require验证器，这是mongoose的内建验证器，现在我们详细了解一下这个内建验证器，在创建schema时，require的值为布尔值、或者是返回布尔的函数，这在有时候是很有用的，例如，下面的代码就表示，只有当isPblished为true时，price才是必填的：

```javascript
const courseSchema = new mongoose.Schema({
  name: {type: String, required: true},
  author: String,
  tags: [String],
  date: { type: String, default: Date.now },
  isPublished: Boolean, 
  price: { 
    type: Number, 
    required: function () {return this.isPublished}
  }
})
```

> 注意：required 的值是函数时，不能使用箭头函数，因为箭头函数，没有自己的this, 箭头函数使用的this来自就近的执行上下文。如果mongoose再某个地方调用了required的这个函数，那this就会指向那个调用的函数，而不是当前这个schema，所以，需要使用传统的匿名函数。 

这就是require验证器，可以是一个布尔值，也可以是一个返回布尔值的验证函数，还有其他的验证：

- minlength: 表示最小长度
- maxlength: 最大长度
- match: 匹配格式（正则表达式）
- enum: 表示值必须是指定中的其中一个，来看案例：

```javascript
const courseSchema = new mongoose.Schema({
  name: {type: String, required: true},
  // category 的值必须是：
  // 'web', 'mobile', 'network'中的其中一个
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network']
  },
  price: { 
    type: Number, 
    required: function () {return this.isPublished}
  }
})
```

- 数字类型和时间类型的值有额外的两个验证：
  - max: 最大数字
  - min: 最小数字

以上就是mongoose常用的验证器，熟练使用这些验证器可以让我们的数据更加方便安全的写入数据库。

## 自定义验证器
