// ES5 实现继承的几种方式

// 1. 原型链继承：利用原型让一个引用类型继承另一个引用类型的属性和方法
function SuperType (name) {
    // this.name = "super"
}

SuperType.prototype.getName = function () {
    console.log(this.name)
    return this.name
}

SuperType.prototype._objectData = { //引用类型值的属性
    name: "super",
}

function SubType (name, age) {
    this.name = name
    this.age = age
}
// 以下几种原型链继承的关键代码
// plan1：new 的方式的确会创建一个关联到父类原型的新对象，但它执行了 父类函数的构造调用，如果在这个函数里面执行了一些有副作用的代码（修改状态，给this添加数据等），那么就会影响到子类的实例，
// 即子类的原型指向的是父类的实例，那么原来父类的实例属性变成了子类的原型属性，父类原型的引用类型也会被所有的子类实例共享，可能会被意外修改。所以也不是一种好的解决方案
SubType.prototype = new SuperType()
// plan2：此方法并不会创建一个关联到 Super.prototype 的新对象，它只是让 SubType.prototype 直接引用 SuperType.prototype 对象，因此当你执行类似 SubType.prototype.getAge=…… 的赋值语句时，也会直接修改父类的原型（这不是你想要的结果！）
// SubType.prototype = SuperType.prototype 
// plan3：ES5 的时候，我们通过创建一个新的对象（并且把旧对象抛弃掉）的方式将父类原型关联到子类原型上(会带来轻微的性能损失，旧对象需要被垃圾回收机制处理掉)
// SubType.prototype = Object.creat(Foo.prototype)
// plan4：ES6 我们可以借助 Object.setPrototypeOf(...)的方式实现关联
// Object.setPrototypeOf(SubType.prototype,SuperType.prototype)
SubType.prototype.getAge = function () {
    console.log(this.age)
    return this.age
}

SubType.prototype.constructor = SubType // 此处需要手动修复 子类 构造函数指向的问题（否则会指向父类）

let resSub1 = new SubType("zhangyi", 18)
resSub1.getName()
resSub1.getAge()

// Conclusion:
// 通过原型实现继承的缺点：没有办法在不影响所有对象实例的情况下给父类的构造函数传参；包含引用类型值的属性会被所有实例共享。
// let resSub2 = new SubType("zhangyi2",19)
// resSub2._objectData 和 resSub1._objectData 指向的是同一个地址





// 2. 借用构造函数：在子类型的构造函数中调用父类构造函数
function SuperType (name) {
    this.name = name
    this.getName = function () {
        console.log(this.name)
    }
}

// subObj.getName() // 报错 subObj.getName is not a function 不能访问父类原型上的方法
// SuperType.prototype.getName = function(){
//     console.log(this.name)
//     return this.name
// }

function SubType (name) {
    SuperType.call(this, name)
}

let subObj = new SubType("sub name")
subObj.getName()

// Conclusion:
// 可以向超类传递参数
// 解决了原型中包含引用类型值（前提：定义在构造函数中的）被所有实例共享的问题
// 方法要是想被子类调用，必须都写在构造函数中，原型上定义的方法对于子类实例而言是不可见的


// 3. 组合继承（原型链 + 构造函数）
// 组合继承指的是将原型链和借用构造函数技术组合到一块，从而发挥二者之长的一种继承模式。基本思路：
// 使用原型链实现对原型属性和方法的继承，通过借用构造函数来实现对实例属性的继承，既通过在原型上定义方法来实现了函数复用，又保证了每个实例都有自己的属性。

function SuperType (name) {
    this.name = name
}

SuperType.prototype.getName = function () {
    console.log(this.name)
    return this.name
}

function SubType (name, age) {
    SuperType.call(this, name)
    this.age = age
}

SubType.prototype = Object.create(SuperType.prototype) //继承原型链
SubType.prototype.constructor = SubType // 通过 create 方法实现的原型链继承，是没有 constructor 属性的，若需要这个属性，则必须手动修复
// SubType.prototype = new SuperType() // 通过 new 方法实现的原型链继承，constructor 指向的是父类函数，故也需要手动修复
SubType.prototype.getAge = function () {
    console.log(this.age)
    return this.age
}

var obj1 = new SubType("zhangyi", 18)
var obj2 = new SubType("zhanger", 19)

obj1.getName()
obj1.getAge()
obj2.getName()
obj2.getAge()

/**
 SubType {name: "zhangyi", age: 18}
     name: "zhangyi"
     age: 18
     __proto__: SuperType
         constructor: ƒ SubType(name,age)
         getAge: ƒ ()
             __proto__:
                 getName: ƒ ()
                 constructor: ƒ SuperType(name)
                 __proto__: Object

 */



// 4. 原型式继承：实现简单的对象属性继承
// 借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。
// 在没有必要创建构造函数，仅让一个对象与另一个对象保持相似的情况下，原型式继承是可以胜任的。

var superObj = {
    name: "zhangyi"
}
var subObj = Object.create(superObj)
subObj.age = 18
subObj.name === "zhangyi"

// Conclusion:
// 与原型链实现继承一样的问题，引用类型值的属性会被所有实例共享



// 5. 寄生式继承
// 创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。
function creatObj(origin){
    var clone = Object.create(origin)
    clone.sayHi = function (){
        console.log("hi")
    }
    return clone
}

var person = {
    name:"zhangyi",
    age:18
}

var extendedPerson = creatObj(person)
extendedPerson.sayHi()

// Conclusion:
// 使用寄生式继承为对象添加函数，会由于不能做到函数复用而效率低下（类似于在函数func内通过this.funcName=function(){...}定义函数，new func()返回的实例中，每个实例维护一份funcName函数定义，略浪费）
// 同原型链实现继承一样，包含引用值类型的属性会被所有实例共享



// 7. 寄生组合式继承(最优解，方案1. 中已经提到过)
// 所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法，基本思路：
// 不必为了指定子类型的原型而调用超类型的构造函数，我们需要的仅是超类型原型的一个副本，本质上就是使用寄生式继承（Object.create）来继承超类型的原型，然后再将结果指定给子类型的原型。寄生组合式继承的基本模式如下所示：

function SuperType (name) {
    this.name = name
}
// 定义父类原型方法
SuperType.prototype.getName = function () {
    console.log(this.name)
    return this.name
}

function SubType (name, age) {
    SuperType.call(this,name) // <--=== 子类给父类传参
    this.age = age
}

// SubType.prototype = Object.create(SuperType.prototype)
// SubType.prototype.constructor = SubType // <--===== 修复构造函数不一致或者丢失问题
Object.setPrototypeOf(SubType.prototype, SuperType.prototype)  // <--==== ES6 提供的设置原型方法(不需要修复上述构造函数属性)

// 扩展子类原型方法
SubType.prototype.getAge = function(){
    console.log(this.age)
    return this.age
}

var obj1 = new SubType("zhangyi",28)
obj1.getName()
obj1.getAge()