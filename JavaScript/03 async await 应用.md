
# async await 应用
> async await 是ES7新增的处理异步操作的语法，为了使异步编程更加简单直观，避免不必要的回调。

### 开发中常见的异步编程模式：
1. callback（回调函数）
2. 事件监听
3. 发布订阅模式
4. Promise 对象
5. async / await 模式（实质为 Generator / yield 的语法糖）

### Generator / yield 扫盲

##### Generator 函数
可以理解为，Generator 函数是一个状态机，封装了多个内部状态。

执行 Generator 函数会**返回一个遍历器对象**，也就是说，Generator 函数除了状态机，还是一个**遍历器对象生成函数**。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

形式上，Generator 函数是一个普通函数，但是有两个特征。

1. function 关键字与函数名之间有一个星号；
2. 函数体内部使用 yield 表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。

```
function* gen() { 
  yield 1;
  yield 2;
  yield 3;
}

let g = gen(); 
g.next(); //{value: 1, done: false}
g.next(); //{value: 2, done: false}
g.next(); //{value: 3, done: false}
g.next(); //{value: undefined, done: true}
```

#### yield 关键字
yield 关键字用来暂停和恢复一个生成器函数。
yield关键字使生成器函数执行暂停，yield关键字后面的表达式的值返回给生成器的调用者。它可以被认为是一个基于生成器的版本的return关键字。

yield关键字实际返回一个IteratorResult对象，它有两个属性，value和done。value属性是对yield表达式求值的结果，而done是false，表示生成器函数尚未完全完成。

一旦遇到 yield 表达式，生成器的代码将被暂停运行，直到生成器的 next() 方法被调用。每次调用生成器的next()方法时，生成器都会恢复执行，直到达到以下某个值：

* yield，导致生成器再次暂停并返回生成器的新值。 下一次调用next()时，在yield之后紧接着的语句继续执行。
* throw用于从生成器中抛出异常。这让生成器完全停止执行，并在调用者中继续执行，正如通常情况下抛出异常一样。
* 到达生成器函数的结尾；在这种情况下，生成器的执行结束，并且IteratorResult给调用者返回undefined并且done为true。
* 到达return 语句。在这种情况下，生成器的执行结束，并将IteratorResult返回给调用者，其值是由return语句指定的，并且done 为true。

> 如果将参数传递给生成器的next()方法，则该值将成为生成器当前yield操作返回的值。

Generator / yield 实现异步操作DEMO

```
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  doSomething(result); //请求完数据后的操作（注意此处是同步写法）
}

var g = gen(); //执行 Generator 函数，获取遍历器对象
var result = g.next(); //执行异步任务的第一阶段，触发fetch操作

result.value.then(function(data){
  g.next(data); //触发成功回调函数，将数据传递给doSomething函数
});
```
> 可以看到，虽然 Generator 函数将异步操作表示得很简洁（以同步的方式），但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段，都需要人为去手动控制）。后来就出现了可以是Generator自动执行的 **co 模块**

## 进入主题
如上所述，async/await 实际上是 Generator/yield 的语法糖，使用 Generator 虽然可以使异步操作同步化，但是还是需要人为介入（不使用第三方模块co情况下），略显麻烦，体现不出其优势。

针对异步操作同步化，ES7 中有了更加标准的解决方案，新增了 async/await 两个关键词。async可以声明一个异步函数，此函数需要返回一个Promise对象。await可以等待一个Promise对象resolve，并拿到结果。

MDN DEMO

```
var resolveAfter2Seconds = function() {
  console.log("starting slow promise");
  return new Promise(resolve => {
    setTimeout(function() {
      resolve("slow");
      console.log("slow promise is done");
    }, 2000);
  });
};

var resolveAfter1Second = function() {
  console.log("starting fast promise");
  return new Promise(resolve => {
    setTimeout(function() {
      resolve("fast");
      console.log("fast promise is done");
    }, 1000);
  });
};


var sequentialStart = async function() {
  console.log('==SEQUENTIAL START==');

  const slow = await resolveAfter2Seconds(); // step1.等待函数执行完毕
  console.log(slow); // step2.等待两秒后，输出slow

  const fast = await resolveAfter1Second();
  console.log(fast); // 3.再等待一秒后，输出fast（step1-3总共花了3秒）
}

var concurrentStart = async function() {
  console.log('==CONCURRENT START with await==');
  const slow = resolveAfter2Seconds(); // 1.立即开始计时，注意：这个地方没有用 await，所以不会阻塞，下面代码正常执行
  const fast = resolveAfter1Second(); // 1.立即开始计时

  console.log(await slow); // 2.等待两秒后，输出 slow，注意：此处用了 await ，所以下面的代码会等待这一行执行完再执行，尽管fast先到达执行时间
  console.log(await fast); // 3.上一部执行完毕后，立即输出 fast（step1-3总共花了2秒），因为step2执行完后，计时器已经到达，所以立即执行，无需等待
}
```
实际应用场景

1. await 实现简单 sleep 操作

```
function sleep(time){
	return new Promise((resolve,reject)=>{
		setTimeout(resolve,time)
	})
}
async function one2FiveInAsync(){
	for(var i = 1;i<=5;i++){
		console.log(i);
		await sleep(1000); //await 等待的是一个 promise 的 resolve，故上述sleep函数的timeout中若改为reject，则只会打印一个1
	}
}
one2FiveInAsync();
```
2. await 实现retry机制

```
const superagent = require('superagent');
const NUM_RETRIES = 3;

async function test() {
  let i;
  for (i = 0; i < NUM_RETRIES; ++i) {
    try {
      await superagent.get('http://google.com/this-throws-an-error');
      break;
    } catch(err) {}
  }
  console.log(i); // 3
}

test();
```
3. 需求：实现一个红绿灯，把一个圆形div按照绿色3秒，黄色1秒，红色2秒循环改变背景色。

```
    function sleep(duration) {
      return new Promise(reslove => {
        setTimeout(reslove, duration);
      })
    }
    async function changeColor(duration, color) {
      console.log(color);
      await sleep(duration);
    }
    async function main() {
      while(true) {
        await changeColor(3000, "green");
        await changeColor(1000, "yellow");
        await changeColor(2000, "red");
      }
    }
    main()
```


> ##### 使用注意
> 1. 使用 await 关键字时，函数就得用 async 修饰，否则报错；
> 2. async 修饰的函数  返回一个 promise；
> 3. await 放在调用之前，外层包一层 try ... catch 使用 可以获取异常；
> 4. 当执行到 await 修饰的这行代码（通常是一些异步行为，例如http请求，读取文件等），会等待结果返回，再执行其下面的操作（**注意，此处提到的 下面的操作 是await所在的由async修饰的函数内部的代码，并不会使JS主线程停止，外部如果有代码的话依旧会正常继续执行**）


## 总结
1. callback(回调函数)：写起来方便，不过过多的回调会产生回调地狱，代码横向扩展，过多的回调不易于维护和理解；
2. 发布订阅模式：通过实现个事件管理器，方便管理和修改事件，不同的事件对应不同的回调，通触发事件来实现异步，不过会产生一些命名冲突的问题（在原来的Event.js基础上加个命名空间，防止命名冲突即可），事件到处触发，可能代码可读性不好；
3. Promise对象：本质是用来解决回调产生的代码横向扩展，及可读性不强的问题，通过.then方法来替代掉回调，而且then方法接的参数也有限制，所以解决了，回调产生的参数不容易确定的问题，缺点的话，个人觉得，写起来可能不那么容易，不过写好了，用起来就就方便多了；
4. Generator(生成器)函数：记得第一次接触Generator函数是在python中，而且协程的概念，以及使用生成器函数来实现异步，也是在python中学到的，感觉javascript有点是借鉴到python语言中的，不过确实很好的解决了JavaScript中异步的问题，不过得依赖执行器函数；
5. async/await：这种方式可能是javascript中，解决异步的最好的方式了，让异步代码写起来跟同步代码一样，可读性和维护性都上来了。

### 参考文档
[MDN async](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function) && [MDN await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)

[阮一峰 ES6 async](http://es6.ruanyifeng.com/#docs/async)