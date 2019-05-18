(function(exports, require, module, __filename, __dirname) {
    // var x =; // 必须写在第一行，前面有空行都不行
    function log(msg) {
        console.log(msg)
    }
    module.exports.log = log
    // 也可以简写成：
    exports.log = log

    // 导出单个成员
    // exports = log 错误!

    // 对于单个成员的导出不可以使用简写方式
    // 因为exports 是 module.exports 的引用
    // 相当于在内部使用了 exports = module.exports
    // 导出单个成员如果使用了简写方式
    // 就相当于把 exports 重新赋值了：exports = log
})