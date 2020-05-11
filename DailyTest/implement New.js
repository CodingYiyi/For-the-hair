// 实现一个 new 函数
// JS中不存在所谓的‘构造函数’，只有函数的‘构造调用’
// new 函数干了些啥？
// step1：创建一个全新的空对象
// step2：这个新对象被执行[[prototype]]链接
// step3：绑定这个新对象到函数调用的this
// step4：如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象

function _new(func,...args){
    var target = Object.create(null) //1
    target.__proto__ = func.prototype //2
    var result = func.apply(target,args) //3
    if(result && typeof (result) == 'object' || typeof (result) == 'function' ) return result //4
    return target
}

function test (name){
    this.name = name
}

var newF = _new(test, 'zhangyi1')
console.log(newF)

new test("zhangyi2")
console.log(test)