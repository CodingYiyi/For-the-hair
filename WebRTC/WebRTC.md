# WebRTC

> WebRTC (Web Real-Time Communications) 是一项实时通讯技术，它允许网络应用或者站点，在不借助中间媒介的情况下，建立浏览器之间点对点（Peer-to-Peer）的连接，实现视频流和（或）音频流或者其他任意数据的传输。WebRTC包含的这些标准使用户在无需安装任何插件或者第三方的软件的情况下，创建点对点（Peer-to-Peer）的数据分享和电话会议成为可能。--MDN

## Q1：WebRTC是干什么的？
通俗来讲，WebRTC是一项即时通讯技术，它的特点在于不依赖第三方server的情况下，仅仅通过两个浏览器（前提是支持webrtc）可以实现即时通讯。

## Q2：WebRTC和websocket有何区别？

> WebSocket 是一种在客户端与服务器之间保持TCP长连接的网络协议，这样它们就可以随时进行信息交换。通过WebSocket，服务器可以直接向客户端发送数据，而无须客户端周期性的请求服务器，以动态更新数据内容。

通俗来讲，**websocket是一种client端和server端的通信协议**，如下图，一个server可以同时和多个client建立websocket链接，不同的client之间是无法直接通信的，如果client_1想要下发一个message给其他client，需要先将此message发送给server，然后通过server将其下发至不同的client，这期间其他的client处于等待状态，这就存在一个消息延迟的问题，对于那些对实时性要求高的需求，例如voice chat 或者 live streaming就满足不了需求了。

![websocket.png](https://i.loli.net/2020/05/17/4sQiMt9JRSYhUup.png)

再来看WebRTC做了些什么：

![WebRTC.png](https://i.loli.net/2020/05/17/asYOPStv9m7urIZ.png)

首先值得注意的一点是，WebRTC完整的通信过程中也是有server参与的，但是这个server只是在两个client建立通信的初期参与。一旦通信建立完成，两个client互相发送消息的过程中，server是不参与的。接下来就是两个client直接通讯了，所以相对于websocket的方式来说，延迟会小很多。

## Q3：WebRTC是怎么将两个毫不相关的client建立链接的？


> WebRTC**包含了若干相互关联的API和协议**以达到这个目标 ：[WebRTC 协议介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Protocols)

### Q3-1：互联网上的两台设备，如何定位到彼此？
> 有很多原因能导致简单的从client1到client2不能直连：这需要绕过阻止建立连接的防火墙，给你的设备分配一个唯一可见的地址（通常情况下我们的大部分设备没有一个固定的公网地址），如果路由器不允许主机直连，还得通过一台服务器转发数据。
> ![wifi.png](https://i.loli.net/2020/05/17/dNGbj7YzsEUynDK.png)

如果链接到互联网中的设备都独有一个外网ip，那么互相定位还是很容易的，只要双方提供ip即可。但是目前的网络情况下通常是多个设备共用一个外网ip（例如同一个wifi环境下的多台设备），只不过每台设备的内网ip不同，这个时候如何通过路由器的外网ip以及分配给各台设备的内网ip精确定位到一台设备，这其中就涉及到了[ICE：让两端能够互相找到对方并建立一个连接](https://developer.mozilla.org/zh-CN/docs/Glossary/ICE)相关技术。

**1.STUN协议（which is super cheap,but doesn't always work）**

NAT的会话穿越功能Session Traversal Utilities for NAT (STUN)是一个允许位于[NAT：用来给你的（私网）设备映射一个公网的IP地址的协议](https://en.wikipedia.org/wiki/Nat)后的客户端找出自己的公网地址，判断出路由器阻止直连的限制方法的协议。

客户端通过给公网的STUN服务器发送请求获得自己的公网地址信息，以及是否能够被（穿过路由器）访问。

![STUN server.png](https://i.loli.net/2020/05/17/oLngrph1HSmcsdu.png)

这个图是不似曾相识？这就是上文提到的 WebRTC 中也有server的参与，这个server之一就是 STUN server。

**2.TURN协议（当STUN行不通的时候，就该它上场了）**

网络地址转换协议Network Address Translation (NAT) 用来给你的（私网）设备映射一个公网的IP地址的协议。一般情况下，路由器的WAN口有一个公网IP，所有连接这个路由器LAN口的设备会分配一个私有网段的IP地址（例如192.168.1.3）。私网设备的IP被映射成路由器的公网IP和唯一的端口，通过这种方式不需要为每一个私网设备分配不同的公网IP，但是依然能被外网设备发现。

一些路由器严格地限定了部分私网设备的对外连接。这种情况下，即使STUN服务器识别了该私网设备的公网IP和端口的映射，依然无法和这个私网设备建立连接。这种情况下就需要转向TURN协议。

>一些路由器使用一种“对称型NAT”的NAT模型。这意味着路由器只接受和对端先前建立的连接（就是下一次请求建立新的连接映射）。

>NAT的中继穿越方式Traversal Using Relays around NAT (TURN) 通过TURN服务器中继所有数据的方式来绕过“对称型NAT”。你需要在TURN服务器上创建一个连接，然后告诉所有对端设备发包到服务器上，TURN服务器再把包转发给你。很显然这种方式是开销很大的，所以只有在没得选择的情况下采用。

![TURN server.png](https://i.loli.net/2020/05/17/q1Drb2IYTJ9KQUl.png)

### Q3-2：怎么样建立通讯？

通过上述方式，已经可以在茫茫互联网中找到target，但是接下来又需要做些什么事情才能正确在两者之间建立通讯呢？

![webrtc.png](https://i.loli.net/2020/05/17/7IfxG9duFa1kAEo.png)

其中包括信令的发现和协商过程。

## 学习资料

[WebRTC　简介](https://mp.weixin.qq.com/s/NsiU8rVYYMbDjVBGZlr3Xg)