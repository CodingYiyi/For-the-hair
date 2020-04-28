# webpack 热重载

模块热替换(hot module replacement 或 HMR)是 webpack 提供的最有用的功能之一，它允许在运行时更新所有类型的模块，而无需完全刷新。

> HMR 不适用于生产环境，它只应当用于开发环境。

## 灵魂一问：跟live-server有啥区别？

在 webpack HMR 功能之前，已经有很多 live reload 的工具或库，比如 [live-server](http://tapiov.net/live-server/)，这些库监控文件的变化，然后通知浏览器端刷新页面，那么我们为什么还需要 HMR 呢？

其实最主要的原因还是 live reload 工具并**不能够保存应用的状态（states）**，当刷新页面后，应用之前状态丢失。而 webapck HMR 则不会刷新浏览器，而是运行时对模块进行热替换，保证了应用状态不会丢失，提升了开发效率。

## 实现HRM的几种方式

1. [webpack + webpack-dev-server](https://zhuanlan.zhihu.com/p/30669007)，使用 websocket 通信
2. [Webpack + Webpack-Dev-Middleware + Webpack-Hot-Middleware + Express](https://juejin.im/post/5d8b755fe51d45781332e919#heading-0)，使用server-send-event（SSE服务端推送）实现文件推送到浏览器

## vue loader中的热更新是怎么回事？
Vue Loader 是一个 webpack 的 loader，它允许你以一种名为单文件组件 (SFCs)的格式撰写 Vue 组件:

```
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>
```


“热重载”不只是当你修改文件的时候简单重新加载页面。启用热重载后，当你修改 .vue 文件时，该组件的所有实例将在不刷新页面的情况下被替换。它甚至保持了应用程序和被替换组件的当前状态！当你调整模版或者修改样式时，这极大地提高了开发体验。
[官网说明](https://vue-loader.vuejs.org/zh/guide/hot-reload.html)

### 状态保留规则

* 当编辑一个组件的 `<template>` 时，这个组件实例将就地重新渲染，并保留当前所有的私有状态。能够做到这一点是因为模板被编译成了新的无副作用的渲染函数。

* 当编辑一个组件的 `<script>` 时，这个组件实例将就地销毁并重新创建。(应用中其它组件的状态将会被保留) 是因为 `<script>` 可能包含带有副作用的生命周期钩子，所以将重新渲染替换为重新加载是必须的，这样做可以确保组件行为的一致性。这也意味着，如果你的组件带有全局副作用，则整个页面将会被重新加载。

* `<style>` 会通过 vue-style-loader 自行热重载，所以它不会影响应用的状态。

## 业务代码需要做什么？

[模块热替换 API](https://webpack.docschina.org/api/hot-module-replacement/)

需要注意的一点是，并不是简单地在 webpack.config.js 中配置：

```
devServer: {
		hot: true
	}
```
就可以实现热重载了，业务代码也是需要做处理的，否则（js文件修改时）就跟没有启用热重载效果一样，页面都会强制重载以保证获取最新的打包后文件。

例如有一个 a.js 文件，被 import 到了 index.js 中，如果我们希望a.js文件改变时，页面不刷新，而是通过热重载实现文件加载，则需要在index.js中监听 a.js 文件的变化，如下所示：

```
// index.js
if(module.hot) {
    module.hot.accept('./a.js', function() { // <= 这一句必须要有，否则会默认强制整体reload
        // 这里写一些业务相关的代码，以保证最新的a.js的结果可以实时展示到页面上
    })
}
```

## HMR 出错时的降级处理

当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。

<img src="./img/01.png">

## 强烈推荐
* [Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)
* [Webpack 热更新实现原理分析](https://zhuanlan.zhihu.com/p/30623057)