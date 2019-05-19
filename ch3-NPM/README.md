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
当我们允许了`npm i underscore`，npm 会从注册库(https://www.npmjs.com)中下载给定名称的库的最新版，它会保存在一个叫`node_modules`的文件夹中，

