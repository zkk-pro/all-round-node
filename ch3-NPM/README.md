## NPM(Node Package Manager) node包管理工具

### 简介
node 包管理工具基本上是一个命令行工具，也是第三方库注册到 node 的注册机，npm 伴随着 node 而来，安装了 node，也就安装了 npm
- 查看 npm 版本
```javascript
npm -v
// 如果想安装指定版本的 npm，使用自带的 npm 全局安装指定版本
npm install -g npm@5.5.1
```
> node 和 npm 两个程序是各自独立开发的

### package.json 文件
在你向 node 添加任何包之前，需要创建一个文件(在没有该文件时)，那就是 package.json，这个文件本质是一个 JSON 文件，它包含了应用或程序最基本的信息，比如名字、版本、作者、反馈的地址、依赖关系等。所有的 node 的应用都有这个文件。
```javascript
npm init // 使用该命令创建 package.json 文件
```
使用上面的命令创建是一个向导式的、一步步创建的过程，它会问你一些问题：
```javascript
package name:(npm-demo) // 包的名称（默认值是当前文件夹名称）
version: (1.0.0) // 包的版本
description: // 包的描述
entry point: (index.js) // 包默认入口文件
test command: // 测试命令
git repository: // 包的 git 仓库地址
keywords: // 包的关键字
author: // 包的作者
license: (ISC) // 包的授权信息
```
最后一步是打印出即将生成的 package.json 文件，然后询问是否就这样。上面的步骤直接输入你想输入的信息，也可以直接回车使用默认值，也可以使用下面的的方式直接跳过所有步骤使用默认值（后续需要修改的可以在该文件里直接修改）：
```javascript
npm init --yes
// 或
npm init -y 
// 使用默认值创建 package.json 文件
```

### 如何安装一个包
首先试试安装一个很有名的包：`underscore`，打开命令行或终端，进入到程序的目录，然后输入：
```javascript
npm install underscore
// 或
npm i underscore // i 是 install 的缩写
```
当命令结束后，发生了两件事：
1. 在 package.json 文件中可以看到一个新的“依赖”(dependencies)属性，在该属性下面就是刚才安装的包`underscore`:
```json
{
  "name": "ch3-npm",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "underscore": "^1.9.1"
  }
}
```
在这个 package.json 文件中标识了每个依赖库的名字和版本（版本中的冥符号`^`后面会说到）。
当我们允许了`npm i underscore`，npm 会从注册库(https://www.npmjs.com) 中下载给定名称的库的最新版，它会保存在一个叫`node_modules`的文件夹中：

![node dir](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_dir.png?raw=true)

我们会发现在 underccore 这个模块下面又有一个 package.json 文件，每一个模块都有自己的 package.json。
> 自以前的 npm 版本中，使用 `npm i underscore --save` 这种命令，如果没有`--save`这个参数，npm 的package.json 中的依赖（dependencies）就不会添加 underscore 库的信息，这个行为特征在新版的 npm 中改变了，所以不用刻意的添加`--sava`这个参数了。

### 使用一个包
```javascript
// 引入模块
const _ = require('underscore)
```

**require 函数加载模块的过程**

1. 首先 require 函数会认为你需要一个Core module（核心模块），在 node 中没有一个叫 underscore 的核心模块
2. 然后 require 函数就会认为，也许有叫这个名字的文件或者文件夹，但是，我们在之前说过，当你要引用文件的文件时，需要使用相对路劲，例如`require(./underscore)`。如果使用了路径方式作为参数传递给 require 方法，那么就会认为在当前目录下有一个`underscore.js`的文件，如果不是，它还会认为在当前目录下有一个叫`underscore`的`文件夹`，该文件夹下有一个`index.js`的文件
3. 如果上面都不是，require 函数会假设第三种可能，它会认为在`node_modules`文件夹中有一个叫`underscore`的库，找到了之后，会读取这个库的 package.json 文件，并找到`main`字段，这个字段是库的入口文件，然后开始加载这个文件。

> 总结来说：首先假设参数名时一个核心模块，否者它就假设参数名是一个文件或者文件夹，如果不是，他就会在 node_module 文件夹里寻找
**使用库**
```javascript
const _ = require('underscore)

// 使用 underscore：查找数组里是否包含某个数
let bool = _.contains([1,2,3,4], 3)
console.log(bool) // true
```

### 包说明

**引子**

通过之前的讲解，我们已经学会如何安装一个包，So，现在请你自己安装一个包`mongoose`

```javascript
npm i mongose
```



安装完成后，在`package.json`中的依赖(dependencies)中你会看到多了一个`"mongoose": "^5.5.10"`:

![install_mongoose](https://github.com/zkk-pro/all-round-node/blob/master/assets/install_mongoose.png?raw=true)

再看一下 `node_modules` 文件夹：

![node_modules_dir](https://github.com/zkk-pro/all-round-node/blob/master/assets/node_modules_dir.png?raw=true)

**Q:**

你会看到多了很多目录，我们不是只安装了`underscore`和`mongoose`两个模块包吗，怎么会这么多⁉️

**A:**

这里面其他的库，是其他的 node 模块包，并且是`mongoose`模块依赖的库，在以前的 npm 中，并不是这个样子的，所有的第三方依赖的库，都是安装在库自身的 node_modules 文件夹下，这样 node 模块和它的依赖是高度耦合的，但是这样就出现了一个问题，一个依赖库可能被多次安装，如果模块的依赖很多，就会得到一个嵌套非常深的文件结构，特别是在 windows 平台，是限制了文件夹嵌套层的数量的。但是，现在 npm 的实现跟以前的不一样了，所有应用的依赖和模块的依赖，都保存在一个`node_modules`文件夹里。但是也有例外，比如两个模块依赖同样的库，但是依赖的版本不一样，这种情况，它们的依赖将各自保存在自身文件夹中。

### 语义化版本控制(SemVer)

在之前，我们提到过冥符号（`^`）。先来了解一下什么是语义化版本控制，在node 包的版本号有 3 个部分(以`.`分割)数字组成，例如我们安装的`mongoose`，版本号是：`^5.5.10`：
- 第一个数字：主要版本号，破坏了现有 api 或更改了依赖
- 第二个数字：次要版本号，主要增加新特性，不会破坏现有 api
- 第三个数字：补丁号或补丁更新（表示修复 bug）
这就是语义化版本控制，那么现在可能会注意到冥符号（`^`），这个符号是告诉 npm 你关心 mongoose 的任何版本更新，只要主版本是`5`，简单说就是，每次安装该包是，都会安装该包主版本中的最新版本。

还有一种符号是`~`，例如`"mongoose": "~5.5.10"`，这又是什么意思呢？这个符号表示的意思是：固定主版本是`5`，次版本是`5`，简单说就是，每次安装该包，只会安装该包固定的主要版本和次要版本的最新 bug 版。

最后，如果前面什么符号都不加，例如`"mongoose": "5.5.10"`，这样的情况下，每次重新安装依赖，都会安装这个版本，也就表示固定版本。

### 列出已安装的包

有时候，有可能 node_modules 安装的包的版本高于或低于`package.json`文件里显示的版本，那么如何查看已安装的库是什么版本呢？
1. 在 node_modules 下找到该包，查看该包的 package.josn 文件里的`version`属性，如果想要知道多个包的版本，这种方式显然有点“累”，请看第2中方式
2. 使用`npm list`命令，会出现一个`tree（树型依赖）`，这个“树”表示包的依赖和包依赖的依赖，这个tree显示了所有的依赖，看起来有点乱，如果只想看当前项目的直接依赖，可以使用`npm list --depth=0`

### 查看一个包的信息
查看一个包的信息可以直接在 npm 官网上搜索到该包后查看，也可在终端中使用npm 命令查看：`npm view mogoose`，使用该命令查看到的就是该包的`package.json`文件：

![npm_view_mogoose](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_view_mogoose.png?raw=true)

有时候，只想查看该包的莫个信息，可以运行：`npm view mongoose dependencies`（只查看该包的依赖信息）

![npm_mongoose_dependencies](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_mongoose_dependencies.png?raw=true)

查看包的版本，可以运行：`npm view mongoose version`

![npm_view_mongoose_version](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_view_mongoose_version.png?raw=true)

查看包的所有版本，可以运行：`npm view mongoose versions`（多了个`s`）

![npm_view_mongoose_versions](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_view_mongoose_versions.png?raw=true)


### 安装特定的包
