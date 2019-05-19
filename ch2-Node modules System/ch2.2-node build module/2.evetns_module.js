
// 事件触发器
const EventsEmitter = require('events') // 这里导入的就是 EventsEmitter 类
// 一个俗成约定，变量名首字母大写表示是一个类
// 类是包含属性和方法的容器

// 1. 为了使用事件触发器，首先要创建类的实例
let emitter = new EventsEmitter()

/*
类和实例
类就像是人类
实例是具体的某个人，比如张三、李四

类定义了人应该具有的属性和行为特征
实例是类的具体某一个对象
*/


//  3.注册一个监听器，使用 addListener 方法
/**
 * 注意：顺序很重要！监听器必须在事件触发之前定义，根据代码从上而下的执行的原则，
 * 如果写在后面，事件触发的时候，监听器的代码还没有被执行
 * 第一个参数是事件名称
 * 第二个参数是回调函数，就是当事件发生时被调用的函数
 */
emitter.addListener('messageLogged', () => {
    console.log('listener called')
})
// 有一个更常用的监听器 `on`，和 `addListener` 是一样的
emitter.on('messageLogged', () => {
    console.log('on called')
})

// 2. 使用 emitter 对象发起一个事件
emitter.emit('messageLogged')
/**
 * 当我们运行程序，发现什么也没有发生
 * 因为我们发起了事件，但是在这个应用中没有任何人注册了对这个事件感兴趣的监听器
 * 监听器就是当事件发生时被调用的函数，现在我们来注册关注`messageLogged`事件发生的监听器
 */




