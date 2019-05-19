
/**
 * 事件触发器拓展
 * 在现实的编程中，很少直接使用 EventsEmitter 对象
 * 相反，应该创建一个类，拥有 EventsEmitter 所有的功能然后再使用它
 * 为什么呢？我们先来看一个例子：
 */


// const EventsEmitter = require('events')
// const emitter = new EventsEmitter()

// // 引入`logger`模块
// const log = require('./logger')

// // 监听器`logger`模块发起的事件，todo something...
// emitter.on('loggerEvent', arg => {
//     console.log('arg: ', arg)
// })
// // 调用模块方法
// log('Hello Node.js')

// 最后发现，监听器没有被触发调用，这是为什么？
// 这是因为我们现在操作的是两个不同的 EventsEmitter 对象！
// 在主模块中有一个 EventsEmitter 实例对象
// 在 logger 模块中有另一个 EventsEmitter 实例对象
// 所以在 logger 中使用了一个 EventsEmitter 实例对象发起事件
// 在主模块中使用了另一个 EventsEmitter 实例对象来处理这个事件
// 这两个实例之间是没有任何关系的，所以这就是说为什么不经常直接使用 EventsEmitter 的原因
// 相反要创建一个继承并拓展了 EventsEmitter 所有能力的类


// improve code 

// 1.引入`logger`模块，它现在是一个类
const Logger = require('./logger')
// 2.创建 Logger 的实例
const log = new Logger()
// 4.使用 log 对象
log.on('loggerEvent', arg => {
    console.log('arg:', arg)
})
// 3.调用 logger 方法
log.logger('Hello, Node.js')


