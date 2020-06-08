# service worker入门

很多人，包括我自己，初看Service Worker多一个Cache Storage的时候，就感觉跟HTTP长缓存没什么区别。
例如大家讲的最多的Service Worker能让网页离线使用，但熟悉HTTP缓存的朋友，会发现，把整站所有资源设置为长缓存（不带校验），也可以实现离线使用。

那么，Service Worker在缓存方面和HTTP缓存比较，有什么好处呢？

在我们讲[浏览器缓存机制介绍与缓存策略](https://juejin.im/book/5b936540f265da0a9624b04b/section/5b9ba651f265da0ac726e5de)的时候，提到过memory cache 和 http cache 之间，还有一个service cache（下文简称sw）的东西，这篇文章就主要以sw为主题，介绍其用法及使用场景。

## web worker？
开始讲sw之前，有一个很容易混淆的概念就是早些年间流行的web worker，其实 service worker 是 web worker 的一种，可一定不要搞混了呀~

[web worker 介绍](http://dwz.date/agm5)

## 步入正题
Service worker除了针对PWA（推送和消息）以外，对普通web来说，在缓存方面，能比http缓存带来一些额外的好处。
可以理解为，SW就是浏览器把缓存管理开放一层接口给开发者。

### 改写默认行为。

例如，浏览器默认在刷新时，会对所有资源都重新发起请求，即使缓存还是有效期内，而使用了SW，就可以改写这个行为，直接返回缓存。

### 缓存和更新并存。

要让网页离线使用，就需要整站使用长缓存，包括HTML。而HTML使用了长缓存，就无法及时更新（浏览器没有开放接口直接删除某个html缓存）。而使用SW就可以，每次先使用缓存部分，然后再发起SW js的请求，这个请求我们可以实施变更，修改HTML版本，重新缓存一份。那么用户下次打开就可以看到新版本了。

### 无侵入式。

无侵入式版本控制。最优的版本控制，一般是HTML中记录所有js css的文件名（HASH），然后按需发起请求。每个资源都长缓存。而这个过程，就需要改变了项目结构，至少多一个js或者一段js控制版本号，发起请求时还需要url中注入冬天的文件名。使用了SW，就可以把这部分非业务逻辑整合到sw js中。
无侵入式请求统计。例如缓存比例统计、图片404统计。

### 额外缓存。

HTTP缓存空间有限，容易被冲掉。虽然部分浏览器实现SW的存储也有淘汰机制，但多一层缓存，命中的概率就要更高了。

### 离线处理。

当监测到离线，而且又没有缓存某个图片时，可以做特殊处理，返回离线的提示。又或者做一个纯前端的404/断网页面。类似Chrome的小恐龙页面。

### 预加载资源。

这个类似prefetch标签。

### 前置处理。

例如校验html/JS是否被运营商劫持？js文件到了UI进程执行后，就无法删除恶意代码，而在SW中，我们可以当作文本一样，轻松解决。当然，在HTTPS环境下出现劫持的概率是极低的。

## SW 使用注意事项

#### 1. 只有localhost 和 https 支持sw，注册才有效。

#### 2. ios部分手机不支持，安卓支持比较好。但是连了代理的环境下，较新的手机都会注册sw失败，报ssl证书有问题。目前连wifi代理的条件下，safar浏览器能注册并缓存成功。

#### 3. 在html上写这么一段代码就能注册sw，其中register第一个参数是指定注册的sw文件，注意sw文件必须在当前页面同级或者更上层。 第二个参数是指定作用的范围，如果浏览器打开过这个html，并且注册这个成功之后，那么scope范围内的其它页面也会受这个sw文件控制了。如果只想当前自己的页面受sw控制，可以直接scope写当前页面的地址。

```
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { //避免还没load就去加载sw.js文件 浪费首屏显示时间
        navigator.serviceWorker.register('/test-sw.js', {
            scope: './'
        }).then(function (e) {
            console.log("Yes, it did.")
        }).catch(function (err) {
            console.log("No it didn't. This happened: ", err)
        });
    });
}
```

#### 4. sw控制页面后，同域下的请求都会走sw的fetch劫持，如果出现http的图片资源就会加载不出来，解决的办法是在sw文件的fetch事件里做判断，只有https的请求才去fetch并且缓存。代码处理如下:

```
self.addEventListener('fetch', function(event) {
  if(event.request.url.indexOf('https') != 0) return
  console.log('fetch', event.request.url)
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // cache hit
      if (response) {
        return response;
      }
      return util.fetchPut(event.request.clone());
    })
  );
});
```

## 很好用的workbox

## 相关链接

[Service Worker 从入门到进阶](https://www.jianshu.com/p/08c0fdec31b4)
[理解Service Worker](https://zhuanlan.zhihu.com/p/28461857)
[设计一个无懈可击的浏览器缓存方案：关于思路，细节，ServiceWorker，以及HTTP/2](https://zhuanlan.zhihu.com/p/28113197)
[Workbox 3：Service Worker 可以如此简单](https://fed.taobao.org/blog/taofed/do71ct/workbox3/?spm=taofed.homepage.header.13.7eab5ac82ByuLw)