# RESTful 服务

## 什么是 RESTful❓
RESTful：状态表征转移（Representational State Transfer），也称为RESTful API，在现在web应用中，大多数都采用BS架构，应用的本身就是客户端端（前端部分），在底层它需要与服务器对话获取数据，这个对话是在HTTP协议下进行的，HTTP是用于支撑web技术的协议，服务器通过HTTP协议提供各种开放的功能服务，客户端通过发送HTTP请求来获取这些服务。本质上讲，REST就是用来创建这些规范的HTTP服务的，所以，我们使用简单的HTTP协议原则，提供数据的增(Create)查(Read)改(Update)删(delete)服务，我们把这些操作统称为`CRUD`操作。
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

安装后，以后运行程序就是用`nodemon index.js`，启动后，nodemon会监测该文件夹所有文件、文件名、文件拓展名的改动，在代码修改保存后，nodemon会自动重启运行应用，这样每次修改就不用手工重启了
