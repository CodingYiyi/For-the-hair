#Javascript 中的 call、apply、bind 解惑
>虾ji⑧谈：JS中的call、apply、bind几乎是面试必问问题，或许有人跟我有一样的困惑：“这三个方法平时开发时基本用不到，为什么非要问呢？反正都不用”，emmmm我只能说：你说的对！或许大家还听说过一句话“面试造火箭、工作拧螺丝”，也不假，但是这些“to火箭工程师”的问题，却是鉴别一个开发人员，是初级开发、中级开发还是高级开发的门槛问题。假如都问很简单的、工作中很实用的问题，大家都回答的很好，那怎么定级呢？



##基本概念
**this对象**：this对象是在运行时基于函数的执行环境绑定的：在全局环境中，this等于window，而当函数被作为某个对象的方法调用时，this等于那个对象。不过，匿名函数的执行环境具有全局性，因此其this对象通常指向window。
每个函数都有自己的执行环境。全局执行环境是最外围的一个执行环境。this指向的就是当前代码所在的执行环境；

**funcName.length**：函数定义时指定的形参个数；

**funcName.name**：函数名；

**funcName.prototype**：类的原型，在原型上定义的方法都是当前这个类的实例的公有方法；

> JavaScript 的一大特点是，函数存在「定义时上下文」和「运行时上下文」以及「上下文是可以改变的」这样的概念。call、apply、bind 常用于改变函数调用时的this指向。

## call与apply
call 和 apply 都是为了改变某个函数运行时的上下文（context）而存在的，换句话说，就是为了改变函数体内部 this 的指向。它俩的唯一区别就是**接受参数的方式**不太一样。

* **apply()**：接受两个参数，第一是个参数是作用域，第二个是参数（可以是数组也可以是arguments对象），**最终调用函数时候这个数组会拆成一个个参数分别传入**，类似于ES6的spread展开语法。
* **call()**：接受多个参数，第一个参数也是作用域，剩下的参数为函数接受的参数（只能一个一个地按顺序传入）。

如下Demo:

```
var func = function(arg1, arg2) {
	...
};

func.apply(this, [arg1, arg2]);
func.call(this, arg1, arg2);
```

JavaScript 中，某个函数的参数数量是不固定的（与函数形参无关），因此要说适用条件的话，当你的参数是明确知道数量时用 call 、而不确定的时候用 apply。然后把参数 push 进数组传递进去。当参数数量不确定时，函数内部也可以通过 arguments 这个数组来遍历所有的参数。

**apply函数特性黑魔法：**获取数组中的最大值

实现思路：Array没有max方法，Math对象上有，因此可以根据apply传递参数的特性将这个数组当成参数传入，最终Math.max函数调用的时候会将apply的数组里面的参数一个一个传入，恰好符合Math.max的参数传递方式

```
const arr = [1,2,3,4,5,6]
const max = Math.max.apply(null, arr)
console.log(max) // 6
console.log(Math.max(...arr)) // 6
```
##bind
bind() 方法与 apply 和 call 很相似，也是可以改变函数体内 this 的指向。不过它的调用结果返回的是一个新的，执行上下文被改变过的函数，而不是函数的执行结果。

```
var name = "名字";
var person = {name: "小明"};
function sayHello () {
	console.log(this.name + ': hello')
}
var personSay = sayHello.bind(person); //返回的是一个函数，需要调用。
personSay(); // 小明：hello
```
>bind 传参方式与call一致，也是**按照顺序依次传入，而不是接受一个数组**。

##MDN文档是这么说的~
1、**call**：`fun.call(thisArg, arg1, arg2, ...)`

* thisArg: 在fun函数运行时指定的this值。需要注意的是，指定的this值并不一定是该函数执行时真正的this值，如果这个函数处于**非严格模式下，则指定为null和undefined的this值会自动指向全局对象(浏览器中就是window对象)**，同时值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象。
* arg1, arg2, ... 指定的参数列表

2、**apply**：`fun.apply(thisArg, [arg1, arg2, ...])`

* thisArg：在fun函数运行时指定的this值。需要注意的是，指定的this值并不一定是该函数执行时真正的this值，如果这个函数处于**非严格模式下，则指定为null或undefined时会自动指向全局对象（浏览器中就是window对象）**，同时值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象。
* [arg1, arg2, ...]：**一个数组或者类数组对象（函数arguments对象）**，其中的数组元素将作为单独的参数传给fun函数。如果该参数的值为null或undefined，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。

3、**bind**：`fun.bind(thisArg[, arg1[, arg2[, ...]]])`

* thisArg：当绑定函数被调用时，该参数会作为原函数运行时的this指向。当使用new操作符调用绑定函数时，该参数无效。
* arg1, arg2, ... 当绑定函数被调用时，这些参数将**置于实参之前传递给被绑定的方法**。

```
function a (...args){
   console.log(args);
}
var b = a.bind(null,1,2);
b(3,4,5); // [1,2,3,4,5]
```

##总结
1. 当我们使用一个函数需要改变this指向的时候才会用到call、apply、bind；
2. 如果你要传递的参数不多，则可以使用fn.call(thisObj, arg1, arg2 ...)；
3. 如果你要传递的参数很多，则可以用数组将参数整理好调用fn.apply(thisObj, [arg1, arg2 ...])；
4. 如果你想生成一个新的函数长期绑定某个函数给某个对象使用，则可以使用const newFn = fn.bind(thisObj); newFn(arg1, arg2...)；
5. apply、call、bind三者第一个参数都是this要指向的对象，也就是想指定的上下文；
6. apply、call、bind三者都可以利用后续参数传参；
6. bind是返回对应函数，便于稍后调用；apply、call则是立即调用 。

