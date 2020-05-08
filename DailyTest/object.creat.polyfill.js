// object.creat(...) 会创建一个新对象，并把它关联到(原型链的方式关联)我们指定的对象，这样我们就可以充分发挥[[Prototype]]机制的优势（查找原型链），访问旧对象上的属性
// 并且避免不必要的麻烦（比如使用 new 的构造函数调用会生成 .prototype 和 .constructor 引用，详见隔壁 what'sClassExtend.js）

// 早期写法
// Object._create = function (O) {
//     function F () { }
//     F.prototype = O
//     return new F()
// }

Object._create = function (O) {
    var o = {}
    return Object.setPrototypeOf(o, O) // Object.setPrototypeOf 为 ES6新语法
}

var originObj = {
    name: "zhangyi"
}
var createdObj = Object._create(originObj)
console.log(createdObj)
console.log(createdObj.name) // "zhangyi"

// warning：wrong implement!
Object._create = function (O) {
    var o = {}
    o.prototype = O // 直接访问的是o对象的键名为“prototype”的属性，返回undefined
    return o
}


// 区别 Object.create 和 Object.assign
// Object.create 是 ES6 新增加的函数，用于扩展对象的原型链
// Object.assign 是 ES5 的函数，用于拷贝对象属性至一个新的对象
// 二者返回的结果对象都能访问到参数对象上的属性值，但是实现方式不一样，前者是通过原型链查找，后者是通过属性拷贝
var testObj = {
    name:"hello"
}
var createdObj = Object.create(testObj)
// {}
//   __proto__ 
//     name: hello
//     __proto__: Object

var assignedObj = Object.assign({},testObj)
// {
//   name: hello
// }
//   __proto__: Object