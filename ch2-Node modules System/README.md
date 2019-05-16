# Node 模块系统

## 全局对象和全局函数
> 全局对象和全局函数的作用域是全局的，可以下任何一个文件下使用

- console.log()
- setTimeout
- clearTimeout
- setInterval
- clearInterval

在浏览器中，window 就是全局对象，所以被定义的全局函数或对象都可以通过window访问，例如：`console.log()`可以通过`window.console.log()`访问，一般都直接省略window关键字，JavaScript引擎会自动前置window关键字。

> 需要注意的是：没有在function中定义的变量叫全局变量，如：var name = 'hey'，这个变量属于window对象。

在Node中没有window关键字，但是有一个全局对象是`global`，上面的这些方法都可通过`global`调用，例如：`global.console.log()`，一般的在使用时，都会省略。

> 需要注意的是：没有在function中定义的变量，并没有添加到global对象中，它的作用域只属于它所在的文件中。这就是Node的模块化系统所致。

**总结**

在浏览器中，当定义一个函数或者变量，它的作用域是全局的，这是因为JavaScript是没有模块化的概念的

## 模块
在Node中，存在模块化的概念，那就是module对象，这是一个特殊的对象，看似想全局对象，但其实不是，并不同通过`global.module`访问，在Node中，一个文件就是一个模块，模块中定义的成员作用域只在模块中，在模块外是不可见的。

```javascript
console.log(global.module) 
// undefined  module对象不是全局对象，并不属于global

console.log(module) // 打印module对象
/*
Module: {
    id: '.',
    exports: {},
    parent: null,
    filename: '/Users/iamkunya/Desktop/all-round-node/ch2-Node modules System/app1.js', 
    loaded: false,
    children: [],
    paths: ['/Users/iamkunya/Desktop/all-round-node/ch2-Node modules System/node_modules',
        '/Users/iamkunya/Desktop/all-round-node/node_modules',
        '/Users/iamkunya/Desktop/node_modules',
        '/Users/iamkunya/node_modules',
        '/Users/node_modules',
        '/node_modules'
    ]
}
*/
```

### 模块的创建导出和加载
首先我们需要创建2个文件，一个`app.js`为主模块，一个`message.js`被引用模块：
```javascript
|- app.js
|- message.js
```
**创建和导出模块**
创建`message.js`模块，内容为：
```javascript
// message.js
let name = 'hey'

function todo() {
    console.log('todo')
}
```
要在`app.js`中访问`message.js`的变量或函数，需要先调用`message.js`模块，因为在模块中的成员外部是不可访问的，所以需要将要被访问的成员变为公有的，那么怎么做呢？

在上面，我们打印出了module对象，里面有一个`exports`属
性，所有添加到这个对象的属性将可以被外部访问，现在我们为`exports`对象添加一个`todo`方法，并赋值为所写的`todo`函数，到处变量也同样的方式：
```javascript
// message.js
let name = 'hey'

function todo() {
    console.log('todo')
}
module.exports.todo = todo
module.exports.myName = name // 在导出的时候可以改名（一般不会这么做）
```
> 在实际开发中，模块是实现一个或一组特定的功能，每个模块都有很多变量和函数，所以有一个原则，尽可能的公开最少限度成员，因为这样可以让模块保持简单易用。举个现实的例子：例如DVD播放器，DVD上只有几个按钮共我们使用，这些按钮相当于模块中公开的成员，但是DVD里面有很多复杂的元件，我们不需要了解它们是如何运作的，这些元件就是DVD实现播放的细节，相当于我们模块中实现功能的细节，其他模块不需要知道该模块的实现细节，它们只需要调用公开的函数即可。

**加载模块**