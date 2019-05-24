# Node 模块化

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

**1、创建和导出模块**

创建`message.js`模块，内容为：

```javascript
// message.js
let name = 'hey'

function todo() {
    console.log('todo')
}
```

要在`app.js`中访问`message.js`的变量或函数，需要先调用`message.js`模块，因为在模块中的成员外部是不可访问的，所以需要将要被访问的成员变为公有的，那么怎么做呢？

在上面，我们打印出了module对象，里面有一个`exports`属性，所有添加到这个对象的属性将可以被外部访问，现在我们为`exports`对象添加一个`todo`方法，并赋值为所写的`todo`函数，到处变量也同样的方式：

```javascript
// message.js
let name = 'hey'

function todo(msg) {
    console.log(msg)
}
module.exports.todo = todo
module.exports.myName = name // 在导出的时候可以改名（一般不会这么做）
```

> 在实际开发中，模块是实现一个或一组特定的功能，每个模块都有很多变量和函数，所以有一个原则，尽可能的公开最少限度成员，因为这样可以让模块保持简单易用。举个现实的例子：例如DVD播放器，DVD上只有几个按钮共我们使用，这些按钮相当于模块中公开的成员，但是DVD里面有很多复杂的元件，我们不需要了解它们是如何运作的，这些元件就是DVD实现播放的细节，相当于我们模块中实现功能的细节，其他模块不需要知道该模块的实现细节，它们只需要调用公开的函数即可。

**2、加载模块**

加载模块我们需要用到`require()`函数，这个函数是Node才有的，浏览器中没有，这个函数需要一个参数，就是我们想要加载的模块名称，在上面，`app.js`主模块和`meaasge.js`模块在同一级目录下，我们用`./`表示当前目录，加载`message.js`模块就是`require(./message.js)`，也可以简写为`require(./message)`，因为Node知道这是一个js文件，会自动添加拓展名。

`require()`函数返回参数是模块导出的对象，在上面中我们知道`module`对象里面有一个`exports`对象，这个对象就是`require`函数得到的东西。

```javascript
// 加载模块
const message = require('./message')
// require 返回的就是 module 里的 exports对象
console.log(message) // { todo: [Function: todo], myName: 'hey' }
// 然后我们就可以直接使用
message.todo('hello, Node.js') // hello, node.js
```

如果是我们的模块只导出一个成员，那么我们没必要给`exports`对象添加属性，而是直接赋值一个变量或者函数：

```javascript
// 导出
function todo(msg) {
    console.log(msg)
}
module.exports = todo

// 引入
const msg = require('./message')
// 使用
msg('Hello, Node.js') // hello, node.js
```

这就是Node中模块的工作方式：定义一个模块，导出一个或多个成员，为了使用模块，我们需要使用`require`函数。作为最佳事件，导入的模块我们应该保存在在常量中(使用`const`定义的变量)，因为后面很有可能意外的将message变量重新赋值，如果重新赋值了，后面使用message的调用就会报错，但是我们定义常量的话，赋值就会报错，配合一些专门的检查工具，我们就能在编写时期检测到错误，从而避免出错。

## Node模块化的原理

- 首先“做好”一个语法错误，故意让程序报错：

```javascript
var x =; // 必须写在第一行，前面有空行都不行
```

- 然后使用node运行该程序，得到报错：

```javascript
(function (exports, require, module, __filename, __dirname) { var x =;
                                                                     ^

SyntaxError: Unexpected token ;
...
```

得到一个函数的描述，这个函数有几个参数：exports、require、module、\__filename和\__dirname。Node并没有直接执行我们写在文件模块中的代码，这些代码被包含在一个`立即执行函数(IIFE)`中，就是上面报错出现的函数，所以在运行时，我们写的代码就变成了这样：

```javascript
(function(exports, require, module, __filename, __dirname) {
    var x =; // 必须写在第一行，前面有空行都不行
})
```
之前我们说过`module`看起来像全局函数，实际上不是，在每个模块中，它都是作为参数传递给函数，是属于模块的本地变量（包括exports、require），所以在每个模块中的代码都被包含在一个`立即执行函数`中，这个函数我们称为`模块包装函数`。

从模块包装函数中可以看到，exports 对象和 module对象，所以 导出模块成员 module.exports.message = message 可以简写成 exports.message = message。但是需要注意的是：对于导出单个成员的方式，就不可使用简写方式，因为 exports 是 module.exports 的引用，相当于在内部使用了 exports = module.exports，导出单个成员如果使用了简写方式，就相当于把 exports 重新赋值了：exports = log，更改了 exports 的引用指向，也就无法导出成员了。

至于后面的两个参数：`__filename`和`__dirname`：
- `__filename`指的是当前文件的完整路径，包含文件名；
- `dirname`指的是当前文件的所在的文件夹目录

**总结**

现在我们对Node的模块运作方式和模块的导出、引入有了一定的了解，知道如何导出模块、引入模块。在Node中内置了很多有用和常用的模块能够帮助我们更好的完成项目，node 的 API 我们不会涉及太多去讲解如何使用，官方文档已经有详细的解释每个大家可以去 node 官网查看，也有中文的文档：`http://nodejs.cn`。

