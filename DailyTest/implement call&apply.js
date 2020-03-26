/**
call 和 apply 的功能相同，都是改变 this 的执行，并立即执行函数。区别在于传参方式不同。
func.call(thisArg,arg1,arg2,...)：第一个参数是 this 指向的对象，其它参数依次传入。
func.apply(thisArg,[argsArray])：第一个参数是 this 指向的对象，第二个参数是数组或类数组。
 */

// 如何模拟实现call
// 函数都可以调用 call，说明 call 是函数原型上的方法，所有的实例都可以调用。即: Function.prototype.call。

// step1. 在 call 方法中获取调用 call()函数
// step2. 如果第一个参数没有传入，那么默认指向 window/global(非严格模式)
// step3. 传入 call 的第一个参数是 this 指向的对象，根据隐式绑定的规则，我们知道 obj.foo(), foo() 中的 this 指向 obj;因此我们可以这样调用函数 thisArgs.func(...args)
// step4. 返回执行结果

Function.prototype._call = function () {
    var [thisArg, ...args] = [...arguments]
    if (!thisArg) thisArg = typeof window == "undefined" ? global : window
    thisArg.func = this // xxx._call() 函数中，this指向原来的函数（xxx），因此可以通过此种方式获取需要执行的原函数
    var res = thisArg.func(...args) // 通过此种方式将 func 中的 this 绑定为 thisArg
    delete thisArg.func // 删除临时属性
    return res
}

function test () {
    console.log(arguments)
    return this.name
}
var name = "zhang"
var obj = {
    name: "yi"
}
console.log(test())
console.log(test._call(obj, 1, 2))
console.log(test._apply(obj, [1, 2]))

// 同理实现 apply 函数
Function.prototype._apply = function () {
    var [thisArg, args] = [...arguments]
    if (!thisArg) thisArg = typeof window === "undefined" ? global : window
    thisArg.func = this
    var res = thisArg.func(...args)
    delete thisArg.func
    return res
}

// 如何实现bind？
// bind 函数特性 ： 参数传递与call相同，返回被绑定过this的函数，而不是函数的执行结果
Function.prototype._bind = function () {
    var [thisArg, ...args] = [...arguments]
    if (!thisArg) thisArg = typeof window === "undefined" ? global : window
    var originFunc = this
    return function F () {
        // 因为返回了一个函数，我们可以 new F()，所以需要判断
        if (this instanceof F) {
            return new originFunc(...args, ...arguments)
        }
        return originFunc.apply(thisArg, args)
    }
}
var name = "zhang"
var obj = {
    name: "yi"
}
function test () {
    console.log(arguments)
    return this.name
}
console.log(test())
var bindedTest = test._bind(obj, 1, 2, 3)
console.log(bindedTest())