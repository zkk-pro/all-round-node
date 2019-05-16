console.log(global.module) 
// undefined  module对象不是全局对象，并不属于global

console.log(module) // 打印module对象
/*
Module: {
    id: '.',
    exports: {},
    parent: null,
    filename: '/Users/iamkunya/Desktop/all-round-node/ch2-Node modules System/app1.js', // 当前文件的位置
    loaded: false, // 值是Boolean，表示这个模块是否被加载
    children: [],
    paths: ['/Users/iamkunya/Desktop/all-round-node/ch2-Node modules System/node_modules',
        '/Users/iamkunya/Desktop/all-round-node/node_modules',
        '/Users/iamkunya/Desktop/node_modules',
        '/Users/iamkunya/node_modules',
        '/Users/node_modules',
        '/node_modules'
    ]
}
*/