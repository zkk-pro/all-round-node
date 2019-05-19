
// 创建一个 logger 模块，在调用的时候发送一个事件`loggerEvent`
// const EventsEmitter = require('events')
// const emitter = new EventsEmitter()

// function logger(msg) {
//     console.log(msg)
//     emitter.emit('loggerEvent', {id: 1, url: 'http://'})
// }

// module.exports = logger


// improve code 改善代码，是当前模块具有 EventsEmitter 类的所有功能
const EventsEmitter = require('events')

class Logger extends EventsEmitter {
    logger (msg) {
        console.log(msg)
        this.emit('loggerEvent', {id: 1, url: 'http://'})
    }
}

module.exports = Logger