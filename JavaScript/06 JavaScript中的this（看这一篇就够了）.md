# JavaScript中的this（看这一篇就够了）
this的五种绑定规则：

1、默认绑定（严格/非严格模式）

2、隐式绑定

3、显式绑定

4、new 绑定

5、箭头函数绑定（ES6规范新增）

其中1~4四种规则可以用一句话概括，即：**this总是指向调用该函数的对象**。箭头函数是ES6规范中新增的，它的绑定机制略有不同，下文会单独分析。

## 默认绑定（区分严格、非严格模式）
独立函数调用，可以把默认绑定看作是无法应用其他规则时的默认规则，this指向全局对象（浏览器中为window对象）。

**规则**：在非严格模式下，默认绑定的this指向全局对象，严格模式下this指向undefined。

````
function foo() { // 运行在严格模式下，this会绑定到undefined
    "use strict";
    console.log( this.a );
}

var a = 2;

// 调用
foo(); // TypeError: Cannot read property 'a' of undefined

// --------------------------------------

function foo() {
    console.log( this.a );
}

var a = 2;

(function() { // 严格模式下调用函数则不影响默认绑定
    "use strict";
    foo(); // 2
})();
````

## 隐式绑定
**规则**：函数在调用位置，是否有上下文对象，如果有，那么this就会隐式绑定到这个对象上。

````
    function foo() {
      console.log(this.a);
    }
    var a = "Oops, global";
    let obj2 = {
      a: 2,
      foo: foo
    };
    let obj1 = {
      a: 22,
      obj2: obj2
    };
    obj2.foo(); // 2 this指向调用函数的对象
    obj1.obj2.foo(); // 2 this指向最后一层调用函数的对象
    
    // 隐式绑定丢失
    let bar = obj2.foo; // bar只是一个函数别名 是obj2.foo的一个引用
    bar(); // "Oops, global" - 指向全局
````

> 隐式绑定丢失：

>隐式绑定丢失的问题：实际上就是函数调用时，并没有上下文对象，只是对函数的引用，所以会导致隐式绑定丢失。

>同样的问题，还发生在传入回调函数中，这种情况更加常见，并且隐蔽，类似：

````
function foo() {
    console.log( this.a );
}
function doFoo(fn) {
    fn(); // 调用位置！
}
var obj = {
    a: 2,
    foo: foo
};
var a = "oops, global"; // a是全局对象的属性
doFoo( obj.foo ); // "oops, global"
//另外，JS环境中内置的setTimeout()函数实现和下面的伪代码类似：
function setTimeout(fn, delay) {
    // 等待delay毫秒
    fn(); // <-- 调用位置，所以fn中的this指向的是默认全局对象
}
````

## 显式绑定
**规则**：我们可以通过apply、call、bind将函数中的this绑定到指定对象上。

````
function foo() {
    console.log(this.a);
}
let obj = {
    a: 2
};
foo.call(obj); // 2，foo中的this被显式绑定为obj对象
````
**上述函数传入的不是对象的情况**：

如果你传入了一个原始值(字符串,布尔类型，数字类型)，来当做this的绑定对象，这个原始值转换成它的对象形式。

如果你把null或者undefined作为this的绑定对象传入call、apply、bind，这些值会在调用时被忽略，实际应用的是**默认绑定规则**。

## new 绑定
* 在JS中，构造函数只是使用new操作符时被调用的普通函数，他们不属于某个类，也不会实例化一个类。
* 包括内置对象函数（比如Number(..)）在内的所有函数都可以用new来调用，这种函数调用被称为构造函数调用。
* 实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”。

**使用new来调用函数，或者说发生构造函数调用时，会自动执行下面的操作：**

1. **创建一个全新的对象**。
2. 这个新对象会被执行 [[Prototype]] 连接。
3. 这个**新对象会绑定到函数调用的this**。
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

**规则**：使用构造调用的时候，this会自动绑定在new期间创建的对象上。

````
function foo(a) {
    this.a = a;
}
//使用new来调用foo(..)时，会构造一个新对象并把new的返回结果（bar）绑定到foo(..)调用中的this。
var bar = new foo(2); // bar和foo(..)调用中的this进行绑定
console.log( bar.a ); // 2
````

根据上述new操作符执行时进行的操作，自定义newFactory函数，第一个参数为constructor函数对象，剩余参数为该函数所要接收的参数。

````
function newFactory(){
	var obj = new Object(); //JS是基于对象的呢，你说我为啥要这么写
	var Con = Array.prototype.shift.apply(arguments);// 获取第一个参数（构造函数），arguments对象也变为剩余参数
	obj.__proto__ = Con.prototype; //链接到原型，obj 可以访问到构造函数原型中的属性
	var ret = Con.apply(obj, arguments); //绑定 this 实现继承，传入剩余参数，取得构造函数的返回值
	return ret instanceof Object ? ret : obj; //如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象
}
````
**代码原理解析**：

1. 用new Object() 的方式新建了一个对象obj
2. 取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
3. 将 obj 的原型指向构造函数，这样obj就可以访问到构造函数原型中的属性
4. 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
5. 返回 obj，[为什么 return 要这么写](https://blog.csdn.net/liwenfei123/article/details/80580883)

**使用方法**：

````
function Person() {...}

// 使用内置函数new
var person = new Person(...)
                        
// 使用手写的new，即newFactory
var person = newFactory(Person, ...)
````

> ### 小结：
>this四种绑定规则的优先级如下
>
>显式绑定 > 隐式绑定 > 默认绑定
>
>new绑定 > 隐式绑定 > 默认绑定
>
>显式绑定和new绑定无法直接比较(会报错)

## 箭头函数中的this****

* 箭头函数无法使用上述四条规则，而是根据外层（函数或者全局）作用域（词法作用域）来决定this。
* **箭头函数中的this继承于它外面第一个不是箭头函数的函数的this指向**。
* 箭头函数的 this 一旦绑定了上下文，就不会被任何代码改变。

````
function foo() {
    // 返回一个箭头函数
    return (a) => {
        // this继承自foo()
        console.log( this.a );
    };
}

var obj1 = {
    a: 2
};

var obj2 = {
    a: 3
}

var bar = foo.call( obj1 ); // foo this指向obj1
bar.call( obj2 ); // 2，不是3！// 输出2 这里执行箭头函数 并试图绑定this指向到obj2，但是由于使用了箭头函数，所以无法修改this
````
foo()内部创建的箭头函数会捕获**调用时foo()的this**。由于foo()的this绑定到obj1，bar(引用箭头函数)的this也会绑定到obj1，箭头函数的绑定无法被修改(new也不行)。

**对于箭头函数的this总结如下**：

* 箭头函数不绑定this，箭头函数中的this相当于普通变量。
* 箭头函数的this寻值行为与普通变量相同，在作用域中逐级寻找。
* 箭头函数的this无法通过bind，call，apply来直接修改（可以间接修改）。
* 改变作用域中this的指向可以改变箭头函数的this。

````
/**
 * 非严格模式
 */

var name = 'window'

var person1 = {
  name: 'person1',
  show1: function () {
    console.log(this.name)
  },
  show2: () => console.log(this.name),
  show3: function () {
    return function () {
      console.log(this.name)
    }
  },
  show4: function () {
    return () => console.log(this.name)
  }
}
var person2 = { name: 'person2' }
person1.show4()()// person1，箭头函数绑定，this指向外层作用域，即person1函数作用域
person1.show4().call(person2)
person1.show4.call(person2)()//箭头函数中的this继承于它外面第一个不是箭头函数的函数的this指向
````
**分析**：
最后一个person1.show4.call(person2)()有点复杂，我们来一层一层的剥开。

1. 首先是var func1 = person1.show4.call(person2)，这是显式绑定，调用者是person2，show4函数指向的是person2。
2. 然后是func1()，箭头函数绑定，this指向外层作用域，即person2函数作用域
首先要说明的是，箭头函数绑定中，this指向外层作用域，并不一定是第一层，也不一定是第二层。

因为没有自身的this，所以只能根据作用域链往上层查找，直到找到一个绑定了this的函数作用域，并指向调用该普通函数的对象。