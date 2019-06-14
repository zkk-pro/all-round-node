const express = require('express')
const config = require('config') // 导入config包

const app = express()
const PORT = process.env.PORT || 3000

console.log('env：', process.env.NODE_ENV)
// 读取配置
console.log('App name: ' + config.get('name'))
// 读取host
console.log('Mail server: ' + config.get('mail.host'))
// 读取环境变量的配置
console.log('Mail Password: ' + config.get('mail.password'))

app.listen(PORT, () => console.log(`app running at ${PORT}`))