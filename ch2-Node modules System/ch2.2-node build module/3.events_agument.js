/**
 * 事件参数
 * 经常我们在发起事件的时候，想带点参数
 * */
const EventsEmitter = require('events')

const emitter = new EventsEmitter()

emitter.on('messageLogged', arg => {
    console.log('on called', arg)
})

// 触发事件，传递参数
// emitter.emit('messageLogged', 1, 'url')
/**
 * 当需要传递多个参数时，更好的做法是把数据封装在一个对象中
 * 我们称这个对象为事件的参数
 */
emitter.emit('messageLogged', {id: 1, url: 'http://'})
