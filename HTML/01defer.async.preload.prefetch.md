# defer async preload prefetch 介绍

>defer 和 async 是 script 标签的属性，而 preload 和 prefetch 是 link 标签的属性

## defer Vs async

### 相同点
1. defer 和 async 在网络读取（下载）这块儿是一样的，都是异步的（相较于 HTML 解析），所以不会阻塞后续dom的解析。

### 不同点
1. defer下载完脚本后不会立即执行，它会等待所有的元素解析完成，在 DOMContentLoaded 事件之前执行
2. async下载完脚本立即执行，所以会阻塞后续dom的解析
3. 多个defer的执行顺序与script标签书写方式一致，多个async是没办法保证顺序的，谁先下载完谁先执行

### 一图胜千言

<img src="./img/01-01.png" />

## prefetch Vs preload

他们都是link标签的rel属性的可选值，都不会阻塞HTML的解析
> 注意: prefetch 和 preload 都只仅仅是预加载，如果要用到预加载的资源，需要手动引入，如下例子

```
<head>
  <meta charset="utf-8">
  <title>JS and CSS preload example</title>

  <link rel="preload" href="style.css" as="style">
  <link rel="preload" href="main.js" as="script">

  <link rel="stylesheet" href="style.css">
</head>

<body>
  <h1>bouncing balls</h1>
  <canvas></canvas>

  <script src="main.js"></script>
</body>
```

上述例子中，预加载了CSS和JavaScript文件，所以在随后的页面渲染中，一旦需要使用它们，它们就会立即可用。

[推荐阅读：使用 Preload/Prefetch 优化你的应用](https://zhuanlan.zhihu.com/p/48521680)


### 相同点
1. preload和prefetch都没有同域名的限制；
2. 都不会阻塞dom的解析；
3. 预加载的资源，都需要在使用的地方显式引用；
4. 当页面上使用到这个资源时候 preload 或 prefetch 资源还没下载完，这时候不会造成二次下载，会等待第一次下载并执行脚本。

### 不同点
1. preload主要用于预加载当前页面需要的资源；而prefetch主要用于加载将来页面可能需要的资源；
2. 不论资源是否可以缓存，prefecth会存储在net-stack cache中至少5分钟；
3. preload需要使用as属性指定特定的资源类型以便浏览器为其分配一定的优先级，并能够正确加载资源（该属性仅在link元素设置了 rel="preload" 时才能使用）；
4. 对于 preload 来说，一旦页面关闭了，它就会立即停止 preload 获取资源，而对于 prefetch 资源，即使页面关闭，prefetch 发起的请求仍会进行不会中断。



支持度检测代码

```
const preloadSupported = () => {
	const link = document.createElement('link');
	const relList = link.relList;
	if (!relList || relList.supports)
		return false;
	return relList.supports('preload');
}
```

[推荐阅读：更快地构建 DOM: 使用预解析, async, defer 以及 preload ★ Mozilla Hacks – the Web developer blog](https://www.zcfy.cc/article/4224)