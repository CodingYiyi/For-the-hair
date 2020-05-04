# Tree-Shaking 应用

## 什么是 tree-shaking？

当我引入一个模块的时候，只使用了部分功能，打包的时候不应该将整个模块全打包到结果中，而是只打包应用到的功能即可。
tree-shaking 起到了剔除无用代码的作用，使最终的包更小。

``` main.js
export function square(x) {
  console.log( x * x )
}

export function cube(x) {
  console.log( x * x * x )
}
```

``` index.js
import { cube } from 'main.js'
cube()
```

上述例子中，虽然我们在main.js中定义了两个函数，但是 square 函数没有被使用过，将其打包到最终的发布包中也只是徒增包的大小，应该去掉。这就是 tree-shaking 的工作。

## 怎么配置 tree-shaking？

关键属性：
* sideEffects 属性
* optimization 属性

### development 模式
1. wepack.config.js
```
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
+ mode: 'development',
+ optimization: {
+   usedExports: true,
+ },
};
```
2. package.json 设置 side-effect-free 文件列表

```
{
  "name": "your-project",
  "sideEffects": false
}

```
设置值为 false 默认会将所有**被 import 的，但是自身没有 export 的文件**从最终的打包文件中剔除掉。因为webpack简单地认为如果你引入了一个模块，但是这个模块自身没有export任何东西，那么这个引用就是无效的。一般情况下，这种看似聪明的行为是ok的，但是我们的确会有一些文件，自身并没有export任何东西，但是却产生了一些副作用，例如babel-polyfill，自身没有export任何东西，但是却在window对象上挂载了一些函数（所以产生了副作用），此时如果简单的使用默认规则，会将其从最终的打包结果中剔除掉（这是错误的）。再或者在js文件中 import css 文件，css文件是没有export的。

这时候就需要用到这个属性了，显式声明一个文件列表（或者规则），让摇树优化忽略对这部分文件的prune

```
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js",
    "*.css"
  ]
}
```

### production 模式

1. wepack.config.js
```
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
- mode: 'development',
- optimization: {
-   usedExports: true,
- }
+ mode: 'production',
};
```
2. package.json 设置 side-effect-free 文件列表

```
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js",
    "*.css"
  ]
}

```

## tree-shaking 使用注意事项

* 只支持 ES Module 即 `import {XXX} from 'filepath'` 的方式，不支持 commonjs 的 require 写法
* 确保上述ESM的代码没有被一些compilers转换成commonjs模块
* 在`package.json`文件中添加 sideEffects 属性
* 摇树优化只在 production 模式下有效

Q：什么是静态引入方式，什么是动态引入方式

1. ES Module 的引入方式为动态引入方式，并且不会缓存值；而 commonjs 的 require 为静态引入方式，并且会缓存值。
2. CommonJS 模块输出的是一个值的拷贝，也就是说一旦输出一个值，模块内部的变化就影响不到这个值；
3. es 模块输出的是值的引用。ES6模块的运行机制与CommonJS不一样，js引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。原始值变了，import加载的值也会跟着变。
4. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

Q：commonjs和es module的区别
1. commonJs是被加载的时候运行，esModule是编译的时候运行
2. commonJs输出的是值的浅拷贝，esModule输出值的引用
3. commentJs具有缓存。在第一次被加载时，会完整运行整个文件并输出一个对象，拷贝（浅拷贝）在内存中。下次加载文件时，直接从内存中取值。

Q：为什么摇树优化只支持es 模块，换句话说，为什么static-module-structure？

简单理解：commonjs 为运行时加载，即不到真正运行到那一行代码的时候，是没法确定依赖的；而 esm 编译时就可以确定需要加载的内容，所以可以做摇树优化

## webpack 的 require.context 加载可以使用 tree-shaking 吗？
在编写 vue 公共组件库的时候，注册至全局的时候使用的一种比较优雅的写法，其中就使用到了 require.context 方法注入模块(如下)，那么这种写法可以被摇树优化掉吗？

```
// import 所有全局公共组件
// import button from  './button.vue'

// Vue.use 方式注册插件必须提供 install 方法
const install = function (Vue) {
    // 通过 Vue.component 方法注册全局组件
    // https://cn.vuejs.org/v2/api/#Vue-component
    // Vue.component(button.name,button)

    // 上述方式在注册多个组件的时候写法略繁琐，可采用下述写法
    // https://cn.vuejs.org/v2/guide/components-registration.html#基础组件的自动化全局注册
    const requireComponents = require.context('.',false,/\.vue$/)
    requireComponents.keys().forEach(fileName => {
        let compM = requireComponents(fileName)
        Vue.component(compM.default.name,compM.default)
    });
}

export default { install }
```

[管理依赖](https://webpack.docschina.org/guides/dependency-management/#require-context)
[Tree Shaking with require.context](https://github.com/webpack/webpack/issues/4181)

[es module](https://exploringjs.com/es6/ch_modules.html#static-module-structure)

[lodash 不能使用 tree-shaking](https://www.zhihu.com/question/333421533/answer/764963886)