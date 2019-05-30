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

【查看一个包的信息】，可以直接在 npm 官网上搜索到该包后查看，也可在终端中使用npm 命令查看：`npm view mongoose`，使用该命令查看到的就是该包的`package.json`文件：

![npm_view_mogoose](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_view_mogoose.png?raw=true)

【查看该包的单个信息】，有时候，只想查看该包的单个信息，可以运行：`npm view mongoose dependencies`（只查看该包的依赖信息）

![npm_mongoose_dependencies](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_mongoose_dependencies.png?raw=true)

【查看包的版本】，可以运行：`npm view mongoose version`

![npm_view_mongoose_version](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_view_mongoose_version.png?raw=true)

【查看包的所有版本】，可以运行：`npm view mongoose versions`（多了个`s`）

![npm_view_mongoose_versions](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_view_mongoose_versions.png?raw=true)

### 包的操作

【安装特定版本的包】，有时候我们需要安装特定版本的包而不是最新的包（npm install xxx默认安装最新版本的包），那么我们可以在包名后面加一个`@`和指定的版本号，安装指定版本命令，可以运行：`npm i mongoose@4.5.6`，运行该命令后，再次查看`package.json`文件，包和依赖已经更新成了我们指定的版本。

![npm_i_mongoose@4.2.0](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_i_mongoose@4.5.6.jpg?raw=true)

同样的，可以使用前面讲解的`npm list --depth=0`查看node_modules文件夹中mongoose的版本，也是`4.5.6`

![npm_list_--depth=0](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_list_--depth=0.jpg?raw=true)

> 练习：
>> 尝试安装指定版本`1.5.0`版本的`underscore`

【对比已安装包和仓库中的包】在现实开发中，可能会有已安装包升级的需要，如何快速了解已安装的包和已发布的包的版本呢？可以使用`npm outdated`：

![npm_outdated](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_outdated.jpg?raw=true)

使用该命令后，可以查看已安装版本及对比在npm仓库中新发布的版本（如果本地包是最新的，就不会列出来）：
- Package：包名
- Current：表示当前已安装的版本
- Wanted：期待的版本，期待指的是：该包`主版本`中最新的版本
- Latest：最新版本

【升级包】可以使用命令`npm update`，但是该命令只会升级`次要版本`和`补丁版本`，因为如果升级了主要版本，很可能已经有核心部分更新了（前面讲过，主要版本的更新可能会破坏了现有 api 或更改依赖），这就会导致项目出错，运行命令：`npm update`：

![npm_update](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_update.jpg?raw=true)

我们看到，underscore 更新到了最新版，因为已安装版本的主版本和npm仓库中的主版本是一样，但是mongoose只更新到了主版本4中的最新版（也是上面对比中的`Wanted`期待版本），这并不是npm仓库中的最新版（当前npm仓库中最新版是`5.5.11`），主版本不一样，如果想更新到和仓库中一样的最新版本，`npm update`是做不到的，如果想更新，就需要另一个命令行工具`npm-check-updates`，运行`npm i -g npm-check-updates`全局安装，然后在命令行中运行：`npm-check-updates`或者`ncu`：

![npm-check-updates](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm-check-updates.jpg?raw=true)

运行后，会显示可升级的包当前版本和可升级的版本（npm仓库中最新版本），然后，可使用`ncu -u`来更新`package.json`文件（注意：只是更新package.json文件哦，还没有依赖），然后再运行`npm i`更新依赖，最后检测一下，运行`npm outdated`，发现没有任何输出结果，表明本地依赖都是最新的，同样的运行`npm-check-updates`(或`ncu`)，输出的提示是：所有依赖都是最新的。

【删除包】删除包可以使用`npm uninstall packageName`（packageName表示包名），或者使用缩写`npm un pakageName`

```javascript
npm uninstall mongoose
// 或
npm un mongoose
```
然后查看`package.json`，mongoose 已经不再依赖中了，同时它也不再node_modules文件中了

### 开发时的依赖库
在现实开发中，有时候我们需要一些只在开发阶段才使用的库，例如进行单元测试时使用的工具、打包JavaScript代码的工具、静态代码分析工具等，这些事在开发时所依赖的，所以这些库在发布的时候不用一起发布，例如安装一个静态代码分析工具：

```javascript
npm i jshint --save-dev
```
在安装命令的时候，添加参数`--save-dev`或`-D`，然后我们再看`package.json`文件：

![npm_i_jshint_-D](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_i_jshint_-D.jpg?raw=true)

可以看到`jshint`被安装到了`devDependencies`属性下，在这个属性下，node就知道这是一个开发依赖，不用发布到生产环境

### 操作全局包
之前我们所安装的包，都是处于某个node工程文件中，但是，有的包不是针对某个应用的（通常是命令行工具），它们被安装在全局中，所谓全局，就是可以在任何文件目录下都可以访问的，比如我们使用的npm命令行工具、或者Vue的脚手架工具`vue-cli`，可以使用它创建一个Vue工程。如果要全局安装一个包，可以在安装包的时候添加一个参数`-g`，例如：

```javascript
npm i -g vue-cli
```

在之前，我们查看项目中已安装的包的版本和npm仓库中最新版本的包的对比，使用`npm outdated`，同样的，全局的包也可以查看对比，但是需要添加一个参数`-g`，命令为：`npm -g outdated`。可以看到全局包的版本对比npm仓库中的版本：

![npm_-g_outdated](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_-g_outdated.jpg?raw=true)

### 发布一个包
我们可以创建一个包，然后发布到npm仓库中。
1. 创建一个文件夹，名称是我们项目的名称，例如叫：`zkk-pro-lib`

```javascript
mkdir zkk-pro-lib
```
2. 进入创建的文件夹，并创建`package.json`文件

```javascript
cd zkk-pro-lib
npm init -y
```
3. 使用代码编辑器打开`zkk-pro-lib`文件夹，创建一个文件`index.js`作为该包的入口，然后就可以编写代码了。

![zkk-pro-lib](https://github.com/zkk-pro/all-round-node/blob/master/assets/zkk-pro-lib.jpg?raw=true)

4. 登陆。如果没有npm的账户，需要创建一个账户，使用命令：`npm adduser`，然后按提示输入用户名、密码、邮箱，如果有账户，使用命令：`npm login`来登陆，同样的，也是按提示输入用户名、密码、邮箱即可登陆。

5. 发布包，我们使用`npm publish`命令

![npm_publish](https://github.com/zkk-pro/all-round-node/blob/master/assets/npm_publish.jpg?raw=true)

> 新注册的npm账户注意要先验证邮箱，不然发布会报错发布了包哦，还要的错误可能是你发布的包的名称在npm仓库中已经存在，这种情况需要修改包的名称，在`package.json`文件中的`name`中。

6. 包发布成功后，尝试安装一下我们自己发布的包吧，运行`npm i zkk-pro-lib`，成功安装后会发现，我们项目中的依赖添加了`zkk-pro-lib`，同时查看node_modules下`zkk-pro-lib`文件夹，正是我们创建的包，查看该包的`package.json`文件，发现该文件比我们之前发布时的信息更多，这是因为当发布包时，npm会创建它自己的`package.json`文件。最后就可以在项目中导入并使用这个包了。

### 更新自己发布的包
当我们想要更新包时，修改完代码后不能直接发布，如果直接发布，会报错说：不能发布与现有版本号重复的版本。根据前面所讲的`语义化版本控制`规则修改`package.json`中的`version`属性，现在我们增加一个功能，没有破坏原有的api，所以修改`次版本号`为`1.1.0`。可以手工修改，也可以借助npm命令修改：
- npm version major: 更新主版本号
- npm version minor: 更新次版本号
- npm version patch: 更新补丁版本号

然后再使用`npm publish`发布新版本

## 总结：
这就是通过npm安装、删除、发布、更新包的所有操作，熟练掌握这些操作，是作为现代前端必备的技能，如果有哪里不清楚的，欢迎与我交流`【WX/QQ：2804059161】`