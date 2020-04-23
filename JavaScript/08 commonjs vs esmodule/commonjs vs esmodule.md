## warning :下述结论，除了第二条，其他的都是错误的。真是惭愧￣ □ ￣｜｜

1. commonjs 输出的肯定是个复杂对象，而 esmodule 可能输出一个简单对象（数值、boolean 类型等）
2. commonjs 的输出值为 module.exports 指向的对象的地址，而不是 module.exports 在内存中的地址
3. commonjs 输出的是值的浅拷贝，esModule 输出值的引用。
   这句话之所以成立，是因为 commonjs 输出的肯定是个对象，所以其值为这个对象的浅拷贝，也就是地址的引用。
   esmodule 输出的是值的引用，如果是简单对象，那就是原始值，如果是复杂对象，那就是这个复杂对象的地址的引用。

## 这些是对的

### Static module structure 的开发规范

- esm 的 import 命令输入的变量都是只读的，不允许在加载模块的脚本里面对其进行重新赋值。（修改复杂对象的属性是可以的，但是不要这么去做，因为会影响其他引用该值的地方，造成程序排查困难）

- 'import' and 'export' may only appear at the top level：export 命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，import 命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

```
function foo() {
    export default 'bar' // SyntaxError
}

foo()
```

- import命令具有提升效果，会提升到整个模块的头部，首先执行。

```
foo(); // 不会报错，这种行为的本质是，import命令是编译阶段执行的，在代码运行之前。
import { foo } from 'my_module'; 
```
- 由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

```
    // 报错
    import { 'f' + 'oo' } from 'my_module';

    // 报错
    let module = 'my_module';
    import { foo } from module;

    // 报错
    if (x === 1) {
      import { foo } from 'module1';
    } else {
      import { foo } from 'module2';
    }   
```

上面三种写法都会报错，因为它们用到了表达式、变量和if结构。在静态分析阶段，这些语法都是没法得到值的。

### Static module structure 的优点

1. 文件合并 bunding 阶段，可以去掉实际没有使用到的代码
2. esm 的开发规范表明不会存在 conditional import 或者 conditional export 的情况出现（摇树优化的前提保障）
3. esm export 为只读的，这代表着用户import一个模块的时候，不需要像commonjs一样先去浅copy一份再去使用，而可以直接访问模块里的数据


## commonjs 的循环依赖机制
[JavaScript 模块的循环加载](http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html)
考虑以下情况：

a.js
```
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```

b.js
```
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```

main.js
```
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```

> When main.js loads a.js, then a.js in turn loads b.js. At that point, b.js tries to load a.js. In order to prevent an infinite loop, an unfinished copy of the a.js exports object is returned to the b.js module. b.js then finishes loading, and its exports object is provided to the a.js module.

CommonJs的循环引用的重要原则：一旦出现某个模块被”循环引用”，就只输出已经执行的部分，还未执行的部分不会输出。
循环依赖发生时，为了避免死循环，a.js exports 一个 unfinished(不完整) 的对象浅拷贝给b使用，然后b就可以正常运行完成，反过头来a也可以正常执行完成。最终main可以正常require两个互相依赖的模块。

上述demo的输出结果如下：
```
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```

## esModule 的循环依赖机制

JavaScript 本身就支持循环引用的，考虑以下代码
```
var a = {
    child:{
        parent:a
    }
}
```
ES6模块的运行机制与CommonJS不一样，它遇到模块加载命令import时，不会去执行模块，而是只生成一个引用。等到真的需要用到时，再到模块里面去取值。
因此，ES6模块是动态引用，不存在缓存值的问题，而且模块里面的变量，绑定其所在的模块。
ES6处理"循环加载"与CommonJS有本质的不同。ES6根本不会关心是否发生了"循环加载"，只是生成一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。

[commonJs 和 esModule 的区别](https://juejin.im/post/5ae04fba6fb9a07acb3c8ac5#heading-6)
[esModule 之 static-module-structure](https://exploringjs.com/es6/ch_modules.html#static-module-structure)