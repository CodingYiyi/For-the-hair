# web worker

* Web Worker无法访问DOM节点；
* Web Worker无法访问全局变量或是全局函数；
* Web Worker无法调用alert()或者confirm之类的函数；
* Web Worker无法访问window、document之类的浏览器全局变量；
* 分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。
* 不过Web Worker中的Javascript依然可以使用setTimeout(),setInterval()之类的函数，也可以使用XMLHttpRequest对象来做Ajax通信。

1. web worker 不能通过 file 文件系统访问，必须要启动一个服务。
该Demo中提供了一个简单的文件服务，web.container.js，或者通过使用npm安装的serve包，使用 serve -s 启动一个

>Uncaught DOMException: Failed to construct 'Worker': Script at 'file:///Users/Jackson/Desktop/Web%E5%89%8D%E7%AB%AF/For-the-hair/JavaScript/03%20web%20worker/worker.js' cannot be accessed from origin 'null'.
    at file:///Users/Jackson/Desktop/Web%E5%89%8D%E7%AB%AF/For-the-hair/JavaScript/03%20web%20worker/main.js:7:19


2. 同页面的 Web Worker

通常情况下，Worker 载入的是一个单独的 JavaScript 脚本文件，但是也可以载入与主线程在同一个网页的代码。

```
<!DOCTYPE html>
  <body>
    <script id="worker" type="app/worker">
      addEventListener('message', function () {
        postMessage('some message');
      }, false);
    </script>
  </body>
</html>
```

上面是一段嵌入网页的脚本，注意必须指定 script 标签的type属性是一个浏览器不认识的值，上例是app/worker (以免被浏览器自动执行)。
然后，读取这一段嵌入页面的脚本，用 Worker 来处理。

```
var blob = new Blob([document.querySelector('#worker').textContent]);
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);

worker.onmessage = function (e) {
  // e.data === 'some message'
};
```

上面代码中，先将嵌入网页的脚本代码，转成一个二进制对象，然后为这个二进制对象生成 URL，再让 Worker 加载这个 URL。这样就做到了，主线程和 Worker 的代码都在同一个网页上面。

3. 主线程
Worker()构造函数返回一个 Worker 线程对象，用来供主线程操作 Worker。Worker 线程对象的属性和方法如下：

* Worker.onerror：指定 error 事件的监听函数。
* Worker.onmessage：指定 message 事件的监听函数，发送过来的数据在Event.data属性中。
* Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
* Worker.postMessage()：向 Worker 线程发送消息。
* Worker.terminate()：立即终止 Worker 线程。

4. 子线程

Web Worker 有自己的全局对象，不是主线程的window，而是一个专门为 Worker 定制的全局对象。因此定义在window上面的对象和方法不是全部都可以使用。
Worker 线程有一些自己的全局属性和方法：

* self.name： Worker 的名字。该属性只读，由构造函数指定。
* self.onmessage：指定message事件的监听函数。
* self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
* self.close()：关闭 Worker 线程。
* self.postMessage()：向产生这个 Worker 线程发送消息。
* self.importScripts()：加载 JS 脚本。


## 总结

web worker虽然是新启动的子线程，运行不会阻塞页面，但与主线程的交互会，如果在web worker的for循环里面直接调用postMessage，仍然会感到页面的操作不够流畅（原因是主线程需要一直不停地处理子线程post过来的消息）。

web worker的应用场景。目前可以百度到的关于web worker的文章内容大部分都是从MDN复制过来的，极少有介绍在实际项目中是如何使用web worker的，当然，按笔者的理解有两方面的原因：

web worker的兼容性问题，主流浏览器对web worker的兼容性还不够高（比如Safari ，IE就更不用说了）；
在项目中引入web worker并不能带来质的改变（从这一点来说，websocket就不一样，引入websocker后基本可以替换掉项目里所有的轮询，达到性能优化的目的，但正常的项目决不可能设计成让前台来处理复杂的业务逻辑）。
当然，这也不表示web worker毫无用武之地，比如下面几个场景：

大数据的处理：

这里所说的大数据处理，并不是指数据量非常大，而是要从计算量来看，通常用时不能控制在毫秒级内的运算都可以考虑放在web worker中执行。

高频的用户交互：

高频的用户交互适用于根据用户的输入习惯、历史记录以及缓存等信息来协助用户完成输入的纠错、校正功能等类似场景，用户频繁输入的响应处理同样可以考虑放在web worker中执行。

最后声明一点，了解后台的同学千万不要认为web worker等同于后台意义的多线程，web worker现在有了多线程的形（有了多线程的用法），但还不具备多线程的神（不具备线程通信、锁等后台线程的基本特性），web worker的本质是支持我们把数据刷新与页面渲染两个动作拆开执行（不使用web worker的话这两个动作在主线程中是线性执行的）。