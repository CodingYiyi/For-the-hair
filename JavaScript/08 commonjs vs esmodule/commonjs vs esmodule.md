## warning :下述结论，除了第二条，其他的都是错误的。真是惭愧￣ □ ￣｜｜

1. commonjs 输出的肯定是个复杂对象，而 esmodule 可能输出一个简单对象（数值、boolean 类型等）
2. commonjs 的输出值为 module.exports 指向的对象的地址，而不是 module.exports 在内存中的地址
3. commonjs 输出的是值的浅拷贝，esModule 输出值的引用。
   这句话之所以成立，是因为 commonjs 输出的肯定是个对象，所以其值为这个对象的浅拷贝，也就是地址的引用。
   esmodule 输出的是值的引用，如果是简单对象，那就是原始值，如果是复杂对象，那就是这个复杂对象的地址的引用。

## 这些是对的

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

[commonJs 和 esModule 的区别](https://juejin.im/post/5ae04fba6fb9a07acb3c8ac5#heading-6)
