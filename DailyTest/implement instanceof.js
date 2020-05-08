// instanceof 操作符的左操作数是一个普通的对象，右操作数是一个函数。
// instanceof 回答的问题是:在 a 的整条 [[Prototype]] 链中是否有指向 Foo.prototype 的对象
function isInstanceof(a,b){
    let rightProto = b.prototype
    let leftProto = a.__proto__
    while(true){
        if(leftProto == null) return false
        if(leftProto == rightProto) return true
        leftProto = leftProto.__proto__
    }
}
function Person(name){
    this.name = name
}

var p = new Person("zhangyi")

console.log(isInstanceof(p,Person) == p instanceof Person)
console.log(isInstanceof(p,Object) == p instanceof Object)
console.log(isInstanceof(p,Function) == p instanceof Function)

// 注意：p instanceof Person 为 true，Person instaceof Function 为 true，但是 p instanceof Function 为 false