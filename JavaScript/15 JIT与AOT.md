# 前端两种编译模式的区别：JIT（just in time）、AOT（ahead of time）

angular 4 开始，执行 ng build --prod 默认为 AOT 模式 [预先（AOT）编译器](https://angular.cn/guide/aot-compiler)

> Angular CLI comes with built-in AoT support. 
In the development target environment, it uses JiT (Just-in-Time) compilation for better developer experiences and faster reloads.

![](https://images2018.cnblogs.com/blog/737565/201803/737565-20180323143005765-1121973018.png)

vue 2.0 引入  vue-loader 使用 .vue 编写文件，默认就是 AOT 了
[尤雨溪：前端工程中的编译时优化](https://zhuanlan.zhihu.com/p/52657205)

[vue github](https://github.com/vuejs/vue/issues/4272)

1. React JSX 的编译

编译前（浏览器不识别的写法）：

```
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

编译后（简单的函数调用，浏览器可以正常识别）：

```
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

2. Vue .vue 文件的编译

编译前（浏览器不识别的写法）

```
<div>
  <h1>I'm a template!</h1>
  <p v-if="message">
    {{ message }}
  </p>
  <p v-else>
    No message.
  </p>
</div>
```

编译后（浏览器可以识别的写法）

```
function anonymous() {
  with(this) {
    return _h(
      'div',
      [
        _h('h1',["I'm a template!"]),
        (message) ?
          _h('p',[_s(message)]) :
          _h('p',["No message."])
      ]
    )
  }
}
```

3. angualar(太复杂了，写了也看不懂😂)


> 总结：AOT 相比于 JIT 的优势
1. 预编译，可以在编译时做很多优化（不必要的代码删除等）
2. 首屏加载更快，不会出现先展示模板，再展示页面的情况（如果是通过script标签引入vue的方式，可能会出现这种情况，因为需要在浏览器端做模板编译）
3. eval 、with 等语法在预编译过程就已经执行过了，所以更加安全

> JIT 的应用场景：动态组件的需求，比如在线Demo的编写

