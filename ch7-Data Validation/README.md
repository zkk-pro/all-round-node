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
  + max: 最大数字
  + min: 最小数字

以上就是mongoose常用的验证器，熟练使用这些验证器可以让我们的数据更加方便安全的写入数据库。

## 自定义验证器

有时候内建的验证器并不能满足我们的要求，例如值是字符串数组：`tags: [String]`，并不能使用`required`，因为传入一个空数组时，mongoose也会认为是合法的，所以就需要自定义验证器，具操作如下：

```javascript
const courseSchema = new mongoose.Schema({
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        return v.length > 0
      },
      message: 'have at least one tag'
    }
  }
})
```

自定义验证器`validate`对象里的`validator`是一个返回布尔值的函数，函数中的参数是当前传入的值，`message`是提示信息。当我们没有传递tags属性时，mongoose实际上会默认实例化为一个空数组：

```javascript
const course = new Course({
    // tags: [], // 不传递，默认为[]空数组
    // tags: null // 如果传递null，报下面的错
    // tags: Cannot read property 'length' of null
  })
```

如果传递null，则报：`tags: Cannot read property 'length' of null`，实际上这不是我们想要要的报错信息，所以上面的验证逻辑的修改一下：

```javascript
const courseSchema = new mongoose.Schema({
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0
      },
      message: 'have at least one tag'
    }
  }
})
```

以上就是自定义验证器，当mongoose提供的验证器无法满足要求时，可以使用这种方式，自己编写验证逻辑。

## 异步验证器

上面我们学习了自定义验证器，但是有时候，验证逻辑可能需要读取别的数据或远端的HTTP服务，这样就产生了异步操作，这时就需要一个异步的验证器了，具体做法如下：

```javascript
  // 自定义异步验证器
const courseSchema = new mongoose.Schema({
  tags2: {
    type: Array,
    validate: {
      validator: function(v, callback) {
        return new Promise(function(resolve, reject) {
          setTimeout(() => {
            resolve(v && v.length > 0)
          }, 3000)
        })
      },
      message: 'have at least one tag'
    }
  }
})
```

在以前的版本中，是异步验证器把`validate`对象的`isAsync`设置为`true`，然后`validator`的函数添加一个回调函数，当异步操作完成后，把异步操作的结果传递给回调函数，此方式已经不推荐了，而是采用返回`Promise`的方式，像上面的代码一样。

## 验证错误

到目前为止，我们只是打印出了错误的信息，现在我们来看看具体的Error对象细节：

```javascript
  try {
    await course.save()
  }
  catch (ex) {
    for (let field in ex.errors) {
      console.log(ex.errors[field])
    }
  }
```

打印出：

![error_object](https://github.com/zkk-pro/all-round-node/blob/master/assets/error_object.png?raw=true)

Error对象里是每一个验证不通过的错误对象，每个对象里有：

- ValidatorError: 验证错误的堆栈信息
- message: 错误提示
- name: 该对象名称
- properties: 该字段里的属性
- kind: 验证器，和 properties.validator 一样
- path: 该字段的名字，和 properties.path 一样
- value: 该字段的值，和 properties.value 一样

通过Error对象，我们可以得到每一个验证不通过的错误对象，从而进一步的对每个错误对象进行单独的处理。

## schema类型选项

在定义schema时，可以直接定义属性的类型，也可以使用对象，在使用对象时，有一些属性上面已经讲过了，如：`type`，`required`，`validate`，`enum`，本小结，我们再来看看其它介个很有用的schema对象属性。

- 字符串类型属性：
  + lowercase: 设置为true时，mongoose会自动将字符串转为小写
  + uppercase: 设置为true时，mongoose会自动将字符串转为大写
  + trim: 设置为true时，会删除字符串前后有空格

```javascript
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    // uppercase: true
    trim: true
  }
})
```

- 数值类型属性：
  + max: 最大数字
  + min: 最小数字
  + get: 获取值是调用，属性值是一个返回处理后的值的函数
  + set: 写入值是调用，属性值是一个返回处理后的值的函数

```javascript
const courseSchema = new mongoose.Schema({
  // 对price属性进行四舍五入
  price: { 
    type: Number,
    required: function () { return this.isPublished },
    get: v => Math.round(v),
    // 写入的时候回去掉小数点
    set: v => Math.round(v)
  }
})
```

工具属性对于特定类型的type会起特定的作用，所以每个类型的数据都有特定的工具属性。

### 总结

本章节讲解了在mongoose中如何进行数据验证，包括mongoose内建验证、自定义验证、异步验证。数据验证是必须的，是为了数据更加安全的写入数据库中，所以在定义schema时，想想每个属性都需要怎么样的验证。okey~thank for your reading!

### 欢迎关注我的公众号

![wx_qrcode](https://github.com/zkk-pro/all-round-node/blob/master/assets/wx_qrcode.jpg?raw=true)