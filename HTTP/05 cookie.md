# cookie 解惑

>HTTP Cookie（也叫Web Cookie或浏览器Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器，如保持用户的登录状态。Cookie使基于无状态的HTTP协议记录稳定的状态信息成为了可能。

Cookie主要用于以下三个方面：

* 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
* 个性化设置（如用户自定义设置、主题等）
* 浏览器行为跟踪（如跟踪分析用户行为，广告等）

## cookie 从哪里来？
> 刚开始浏览器干净地像一张白纸，等待着各个网站在上面画画，后面却变得越来越不堪……

以淘宝网为例，服务器使用response-header的Set-Cookie响应头部向用户代理（一般是浏览器）发送Cookie信息。一个简单的Cookie可能像这样：

```
Set-cookie:name=value;expires=Tue,05 Jul 2011 07:26:31GMT;
path=/;domain=.taobao.com;secure;httponly
```

<img src="./img/05-01.jpg">

## cookie 到哪里去？

<img src="./img/05-02.jpg">
现在，对该服务器发起的每一次新请求，浏览器都会将之前保存的Cookie信息通过request-header的Cookie请求头部再发送给服务器。

## cookie 都有啥属性？

首先明确一点，cookie在浏览器中是以简单的字符串方式存储的。

* domain：限制可以发送cookie的域名，注意其遵循末尾匹配原则，非精准匹配
* path：限制可以发送cookie的文件目录
* expires：浏览器发送请求时，携带cookie的有效期。忽略的话为会话级别，服务器无法显示删除客户端的cookie，但是可以通过覆盖行为达到修改的目的
* secure：限定只有https协议的情况下可以携带cookie发送；
* httponly：使用该属性时，JS无法获取设置了 httponly 的cookie的值（document.cookie方式）但是在web页面内还是可以对cookie进行读取操作（仅限那些没有设置httponly的cookie）
* sameSite：Chrome 51 开始，增加了一个SameSite属性，用来防止 CSRF 攻击和用户追踪。

## 什么是第三方cookie？

<img src="./img/05-03.jpg">

**Q：为什么淘宝的网页下面，出现了奇怪的domain为`.mmstat.com`的cookie？不是说cookie有同源策略么？**

>每个Cookie都会有与之关联的域（Domain），如果Cookie的域和页面的域相同，那么我们称这个Cookie为第一方Cookie（first-party cookie）；如果Cookie的域和页面的域不同，则称之为第三方Cookie（third-party cookie.）。一个页面包含图片或存放在其他域上的资源（如图片广告）时，第一方的Cookie也只会发送给设置它们的服务器。通过第三方组件发送的第三方Cookie主要用于广告和网络追踪。这方面可以看谷歌使用的Cookie类型（types of cookies used by Google）。大多数浏览器默认都允许第三方Cookie，但是可以通过附加组件来阻止第三方Cookie（如EFF的Privacy Badger）。

啥意思？也就是说，各大厂商（有卖货，有做广告导流的，有为卖家提供平台的……）为了是利益最大化，尽可能地获（tou）得（kui）用户的信息，在自己的网站上通过各种方式(1*1的小图片，第三方提供的js文件等)为其他的平台提供用户信息。打个比方，就是你去甲商店里，那里的售货员除了在你身上留自己商店的标记，还附带帮乙商店在你身上打个标记，这样当你去乙商店的时候，它的售货员就能识别出你身上已经打过的标记。第三方Cookies是网络广告公司的最爱，因为它们可以在用户密集的网站上加入自己的代码，从而可以获取自己需要的信息。从理论上讲，它的安全性和“第一方Cookie”是一样的，但是，第一方网站和第三方网站合作的时候，对第三方网站的Cookie没有丝毫控制权，我们对第一方网站的信任，却自动转移到第三方网站上，这就造成一种隐私保护上的隐患。

回过头来看淘宝是怎么做的？如下图，淘宝首页加载了一张1*1像素的图片，这个图片的response-header中带有token，下次再访问第三方的网站时，就会自动携带上这个token。

<img src="./img/05-04.jpg" width="40%">
<img src="./img/05-05.jpg" width="58%">
<img src="./img/05-06.jpg">

> 结论：cookie的同源策略指的是不允许从A网站访问B网站的cookie，但是如果A网站加载了B网站的资源，且这个资源的response-header中携带cookie（非会话级别的cookie），那么访问B网站的时候会携带上这个cookie。

## 针对第三方 cookie

随着用户越来越注重隐私问题，限制第三方cookie迫在眉睫，不能任其肆意妄为。
这也是这篇文章的由来：
[当浏览器全面禁用三方 Cookie](https://mp.weixin.qq.com/s/vHeRStcCUarwqsY7Y1rpGg)
