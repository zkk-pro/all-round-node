# 中间件

Express中一个核心概念就是中间件或者中间函数，一个中间函数，技术上来说就是得到一个请求对象，要么反馈客户端，要么传递给另一个中间函数，在之前，我们已经见过两个中间件函数了，一个是路由句柄函数（处理请求的匿名函数），在Express中，所有的路由句柄函数都是中间件函数，路由句柄函数传入一个请求对象，并向客户端放回数据，它终结了请求的反馈闭环（中间件函数不会再向下传递）；另一个中间件是`express.json()`，当我们调用这个方法时，这个函数返回一个函数对象，也就是一个中间件函数，`express.json()`这个函数的作用就是读取请求，如果请求体是一个JSON格式对象，它就会格式化这个JSON对象并设置`req.body`属性，这就是这个中间件运行时发生的事情。

## 创建自定义中间件

现在让我们看看如何创建一个简单的自定义的中间件，来看代码：

```javascript
const express = require('express')

const app = express()

const PORT = process.env.PORT || 3000

// 自定义中间件
app.use((req, res, next) => {
  console.log('logging...')
  next()
})

app.get('/', (req, res) => {
  res.send('home')
})

app.listen(PORT, () => console.log(`app running port at ${PORT}`))
```

使用`app.use`方法将传递进来的函数插入执行管道中，中间件是按顺序执行的，每次请求都会执行管道中的中间件。next 表示下一个中间件的引用，调用next将控制权交给下一个中间件，如果没有调用，那就没有有闭合请求返回闭环，请求将被无限期挂起。

## Express 内建中间件

在Express中有一些内建的中间件函数，每个服务器获得的请求都会转到中间件函数，在之前我们使用过`express.json()`这个中间件了，这个中间格式化请求体，如果符合JSON格式，就设置好`req.body`属性，其他中间简介如下：

- express.urlencoded()

这个中间件函数是读取通过`urlencoded`传递的数据，urlencoded的请求体格式是：`key=value&key=value`形式的，这是一种传统格式，现在已经不太常用了，基本上就是在form表单post请求中的请求体就是这个样子。这个中间件读取到请求体并格式化好后设置在`req.body`中。

```javascript
// 开启读取urlencoded格式数据
// 设置 extended: true 后就可以通过urlencoded传递数组或复杂的表单数据
app.use(express.urlencoded({extended: true}))
// 读取数据
app.post('/', (req, res) => {
  console.log(req.body)
  res.send('ok')
})
```

- express.static()

使用这个中间件向外提供静态内容，这个中间参数是：需要提供一个静态内容的文件夹，这样我们就可将所有静态内容比如html，js，css、图片等放到这个文件中

```javascript
app.use(express.static('public'))
```

> 需要注意的是，访问的路径并不包含设置的这个`public`目录，static是从根目录开始的

## 第三方中间件

在Express有很多第三方中间件，在官方网站：`http://expressjs.com/en/resources/middleware.html` 中看到所有可以在应用中使用的第三方中间件，每个中间对应用的运行都会带来影响，所以如果不需要中间件的功能，就不要使用，否则会降低Express的执行效率，这里介绍两个第三方中间：

- helmet 中间件：通过设置http头部来加强安全性

```javascript
app.use(Helmet())
```

- morgan 中间件：记录HTTP请求日志，默认请求是在控制台记录日志的，也可以通过设置将日志写在文件中

```javascript
// 需要提供字符串参数来指定格式
app.use(Morgan('tiny'))
```

具体细节的使用可以查看对应的官方文档，中间件的使用对应用的运行效率是有直接影响的，所以在使用之前，需要好好考虑一下是否需要使用该中间件。

## 环境

在实际的开发中，我们需要知道应用运行在什么环境中，例如实在开发环境还是生产环境，也许需要根据环境来决定是否开启某些功能，之前有说过node中有一个`process`全局对象下有一个`env`属性，可以获取环境变量（写法：process.env.NODE_ENV），有一个标准的环境变量`NODE_ENV`这个值返回的是当前node所在的环境的值，如果系统里没有设置，它会放回undefined，同样我们也可以在外部设置它。在Express中，使用`app.get()`可以获得当前系统的多个设定值，其中有一个设定值`env`（其内部起始就是调用了process.env.NODE_ENV），写法是：`app.get('env')`，如果没有指定NODE_ENV，`app.get('env')`返回的是`development`而不是`undefined`，okey！这就是这两个的区别，至于使用哪个，看你的喜好了。看个简单例子：

```javascript
// 在开发环境中开启日志记录
if (app.get('env') === 'development') {
  // 需要提供字符串参数格式化
  app.use(Morgan('tiny'))
  console.log('Morgan enabled...')
}
```

## 配置

上面讲了如何检测当下的环境，现在来看看如何保存应用的配置数据，并且在不同的环境写对应的配置，例如在开发环境链接的是开发环境的数据库。目前npm上最受欢迎的一个配置库是`rc`，但是本篇文章使用的是另一个库`config`，这是一个更好更易用的管理功能包。

- 安装和创建`config文件夹`

```javascript
// 安装config包
npm i config
// 在项目的根目录创建config文件夹
mkdir config
```

在这个文件中，添加3个文件：

![config](https://github.com/zkk-pro/all-round-node/blob/master/assets/config.png?raw=true)

- default.json文件：应用的默认配置

```javascript
// default.json
{
  "name": "My Express App"
}
```

- development.json文件：`在开发环境中`会覆盖default.json文件对应的配置，还可以添加附加的配置

```javascript
// development.json
{
  "name": "My Express App - Development",
  "mail": {
    "host": "dev-mail-server"
  }
}
```

- production.json文件：`在生产环境中`会覆盖default.json文件对应的配置

```javascript
// production.json
{
  "name": "My Express App - Production",
  "mail": {
    "host": "prod-mail-server"
  }
}
```

这种形式的配置可以轻松的查看默认配置以及对应的环境的配置，非常的简明扼要，下面来看看如何在应用中使用配置：

```javascript
// 读取配置
console.log('App name: ' + config.get('name'))
// 读取host
console.log('Mail server: ' + config.get('mail.host'))
```

如果没有设置`NODE_ENV`，那默认读取的是`development`的配置。正常来说，不能讲应用的机密信息保存在这里，例如数据库密码或邮件服务器密码等，如果这样做，那么能查看源码的人都能看到这些机密信息，是不安全的。当我们处理这些机密信息的时候，应当把他保存在环境变量中：

```javascript
// 在命令行中设置环境变量（Mac下）
// 为了区分不同的应用的环境变量，最好在前面设置应用的名称例如这里叫：app
export app_password=1234
```

在应用中读取机密信息，首先需要在config文件夹中创建一个json文件：`custom-environment-variables.json`（注意：确保拼写正确），这个文件映射环境变量和应用配置的关系：

```javascript
// custom-environment-variables.json
{
  "mail": {
    "password": "app_password"
  }
}
```

在应用中读取环境变量的配置

```javascript
// 读取环境变量的配置
console.log('Mail Password: ' + config.get('mail.password'))
```

在`custom-environment-variables.json`文件中映射了`password`和环境变量中的`app_password`的映射关系，利用`config`包可以非常方便的得到配置信息，信息源可以是一个josn文件、环境变量、甚至是命令行的值。

## 调试



