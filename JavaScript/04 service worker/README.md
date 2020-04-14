# service worker入门

在我们讲[浏览器缓存机制介绍与缓存策略](https://juejin.im/book/5b936540f265da0a9624b04b/section/5b9ba651f265da0ac726e5de)的时候，提到过memory cache 和 http cache 之间，还有一个service cache（下文简称sw）的东西，这篇文章就主要以sw为主题，介绍其用法及使用场景。

## web worker？
开始讲sw之前，有一个很容易混淆的概念就是早些年间流行的web worker，可一定不要搞混了呀~

[web worker 介绍](http://dwz.date/agm5)

