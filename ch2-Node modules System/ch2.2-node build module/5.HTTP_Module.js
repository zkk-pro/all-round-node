/**
 * HTTP 模块
 * node 中有一个非常强大的模块就是用于创建网络应用的 HTTP 模块
 * 我们可以利用该模块创建一个服务监听某个给定的端口
 * 这样我们就可以为客户端创建一个后端服务
 */

const http = require('http')

// 在现实中，不会使用这个方式创建服务，太低级了
// const server = http.createServer()
// server.on('connection', (socket) => {
//     console.log('New connection')
// })

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write('Hello, node.js')
        res.end()
    }
    if (req.url === '/api/course') {
        // 返回一个 json 数据
        res.write(JSON.stringify([1,2,3]))
        res.end()
    }
})

server.listen(3000)

console.log('listening on port 3000...')

// 在现实中，我们不会直接使用 http 创建后端服务，
// 理由是当路由规则越来越多时，代码会变得越来越复杂，
// 因为都是在回调函数中线性的增加内容
// 取而代之的是，会使用一些框架，它们可以给应用一个清晰的结构来梳理不同的路由请求
