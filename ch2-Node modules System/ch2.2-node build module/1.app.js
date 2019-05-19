
// 1、path 文件模块
const path = require('path')

let pathObj = path.parse(__filename)

console.log(pathObj)
/*
{ root: '/',
  dir: '/Users/iamkunya/Desktop/all-round-node/ch2-Node modules System/ch2.2-',
  base: 'app.js',
  ext: '.js',
  name: 'app' }

  root：文件的根路径
  dir：文件的路径
  base：文件名（包含扩展名）
  ext：文件拓展名
  name：文件名（不包含扩展名）
*/

// 2、os 系统模块
const os = require('os')
console.log(os.freemem()) // 返回当前可用的内存
console.log(os.totalmem()) // 返回当前总内存
console.log(os.userInfo()) // 获取当前系统用户信息

// 3、fs 文件系统
/**
 * fs 文件操作系统，几乎所有的方法都分为两类，即同步方法和异步方法
 * 记住的是：在正常情况下，永远只用异步方法。
 */
const fs = require('fs')
let files = fs.readdirSync('./') // 返回当前目录下所有文件和文件夹
console.log(files)

fs.readdir('./fs', (err, files) => {
    if (err) return console.log('Error: ', err.message)
    console.log(files)
})