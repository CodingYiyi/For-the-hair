const  { foo }  = require('./test.js'); //拷贝了 foo属性指向 {count: 0} 内存地址的引用

console.log('foo', foo);//'foo',{count: 0}
setTimeout(()=>{
    //看！并没有改变！
  console.log('after 2s foo', foo);//'after 2s foo ' {count: 0}
}, 2000)


// 上述例子证明了commonJs输出的值（{foo}）是原始值(module.exports 指向的值)的浅拷贝，这个【值】指的是 module.exports 指向的值。


// 改进
const test = require("./test.js"); //test 拷贝了 整个输出对象{foo:{count: 0} }内存地址的引用，即此时 test 指向 module.export 指向的地址（是个对象的浅拷贝）。
console.log('foo', test.foo);//'foo',{count: 0}
setTimeout(()=>{
    //保证获取到的是最新的，因为两者指向同一块内存地址
  console.log('after 2s foo', test.foo);//'after 2s foo ' haha
}, 2000)

// 进阶
// commentJs具有缓存。在第一次被加载时，会完整运行整个文件并输出一个对象，拷贝（浅拷贝）在内存中。下次加载文件时，直接从内存中取值，所以只要缓存中的值指向的值没有发生变化，结果就不会变
var test2 =require('./test2');// 浅拷贝，指向的还是{foo:1}的内存，并缓存在内存中

console.log(test2.foo);// 1 //从缓存的内存中取值

setTimeout(()=>{
  console.log(test2.foo) // 1 //从缓存的内存中取值
},2000)


let count = require("./test3.js")
console.log(count)
setTimeout(()=>{
  console.log('after 2s count', count);//'after 2s count ' 1
  console.log("test3:", require("./test3.js"))
}, 2000)