// 模块的创建和导出

let name = 'hey'

function todo() {
    console.log('todo')
}

module.exports.todo = todo
// 在导出的时候可以改名（一般不会这么做）
module.exports.myName = name 