# JWT 无痛刷新 token

## JWT 介绍
jwt 是目前流行的一种用户身份验证方案（相对于session-cookie的方案），一般用户登录成功后，接口会返回两个重要的值：**access_token** 和 **refresh_token**（名字可能因人而异），**access_token** 会跟随后续请求的 Request Header 的 Authorization 字段传输给后端，具体格式为：**Authorization：Bearer access_token的值**

**access_token** 就是用户的身份令牌，所以一旦泄露，会造成很大的困扰，而且**access_token**也是有时效性的，通常处于安全考虑时效时间一般比较短，例如2小时
那么问题来了，如果用户一直在操作页面，2个小时后突然登录失效了，那体验也太差了，这个时候就该**refresh_token**上场了
相对于**access_token**，**refresh_token**的时效性一般一比较长，例如24小时。
常规的做法是：

1. **access_token**未过期，使用**access_token**；
2. **access_token**过期后，判断**refresh_token**的有效性（为了准确一般后端判断），如果**refresh_token**未过期，那么用这个**refresh_token**换取一个新的**access_token**，存放至前端环境供后续请求继续使用；
3. 如果后端判断**refresh_token**也过期了，那只能跳转至登录页让用户重新登录了

具体流程如下图所示：
![截屏2020-05-27 下午8.08.48.png](https://i.loli.net/2020/05/27/rdeVu2p3htMRcA9.png)

其中最复杂的逻辑就是**重发原来的业务请求**部分，这个问题的难点在于：当同时发起多个请求，而刷新token的接口还没返回，此时其他请求该如何处理？

## 实现思路

在请求发起前拦截每个请求，判断token的有效时间是否已经过期，若已过期，则将请求挂起，先刷新token后再继续请求。此时如果后续有新的请求到来其token还未返回，则将后续请求挂起，等待token返回后再重发。

因此我们需要两个变量：

```
let PENDED_REQUTEST_QUEUE = [] // 存储因获取accesstoken而被挂起的请求
let IS_REFRESH_TOKEN = false // 是否正在请求新的accesstoken，避免重复请求
```

共用的set/get函数

```
function __getToken () {
	let token
	try {
		token = JSON.parse(utils.getStorage("userInfo"))
	} catch (e) {
		console.error('Error occured on getting token from storage ')
		// 解析出错跳转至登录页
	}
	return token || {}
}

function __setToken (val) {
	try {
		let {refresh_token} = __getToken() // 获取旧的refresh_token，只更新除了refresh_token之外的其他属性
		val.refresh_token = refresh_token
		utils.setStorage("userInfo", JSON.stringify(val))
	} catch (e) {
		utils.setStorage("userInfo", JSON.stringify({}))
		console.error('Error occured on setting token into storage ')
	}
}
```

### 第一步：拦截请求，检验access_token的有效性

这一步是核心，里面处理了上述提到的两个问题：**避免重复获取token以及后续请求重发的处理。**

通常在业务代码里，我们调用http的写法如下：

```
// 第1个请求
GET(url1,params).then(res=>{....})
......
// 第2个请求
GET(url2,params).then(res=>{....})
......
// 第n个请求
GET(urln,params).then(res=>{....})
```
此时如果n个请求为并行发送，第一个请求调用时发现access_token过期需要获取新的token，应该将后续2~n个请求挂起，等待token回来时再一起发送。那么问题来了，如何挂起请求呢？这里利用了promise的特性：**一个promise，在没有调用resolve或者reject之前，一直处于pending状态**（所以前提就是一个请求无论是挂起状态还是requesting状态，都要return一个promise实例，只不过在新的token返回时再调用这个promise实例的resolve）

```
var p = new Promise((resolve,reject)=>{
	resolve("123") // 只有调用了resolve方法，才会调用then的回调函数，注意是回调函数
	// 下述三种写法都不会打印出123，p永远处于pending状态(注意区别then方法中的return)
	// return "123"
	// return Promise.resolve("123")
	// Promise.resolve("123")
})
p.then(res=>{console.log(res)})

// 加餐：then的参数不是函数的情况
var p2 = new Promise((resolve,reject)=>{
	return "123"
})
p2.then(console.log("此处的代码不会等待上述resolve")) // 即使上述没有resolve，此处也能正常打印

```

> then中的return:
> 
>1. 当一个 Promise 完成（fulfilled）或者失败（rejected）时，返回函数将被异步调用（由当前的线程循环来调度完成）。具体的返回值依据以下规则返回。如果 then 中的回调函数：

>2. 返回了一个值，那么 then 返回的 Promise 将会成为接受状态，并且将返回的值作为接受状态的回调函数的参数值。
>
>3. 没有返回任何值，那么 then 返回的 Promise 将会成为接受状态，并且该接受状态的回调函数的参数值为 undefined。
>
>4. 抛出一个错误，那么 then 返回的 Promise 将会成为拒绝状态，并且将抛出的错误作为拒绝状态的回调函数的参数值。

>5. 返回一个已经是接受状态的 Promise，那么 then 返回的 Promise 也会成为接受状态，并且将那个 Promise 的接受状态的回调函数的参数值作为该被返回的Promise的接受状态回调函数的参数值。
返回一个已经是拒绝状态的 Promise，那么 then 返回的 Promise 也会成为拒绝状态，并且将那个 Promise 的拒绝状态的回调函数的参数值作为该被返回的Promise的拒绝状态回调函数的参数值。

> 6. 返回一个未定状态（pending）的 Promise，那么 then 返回 Promise 的状态也是未定的，并且它的终态与那个 Promise 的终态相同；同时，它变为终态时调用的回调函数参数与那个 Promise 变为终态时的回调函数的参数是相同的。

有了上述对promise的基本了解后，我们看下核心代码：
每发起一个请求，都会执行下述函数

```
// 校验token是否有效
function __requestWithToken (obj, config) {
	let { access_token, refresh_token } = __getToken() ①
	if (utils.isExpired(access_token)) { ②
		if (!IS_REFRESH_TOKEN) { // ③ token 过期并且没有处于正在刷新的过程中，获取新的token
			__getAccessToken(refresh_token).then(_ => { // ④ 得到新的token后，依次重发被挂起的请求队列
				PENDED_REQUTEST_QUEUE.forEach(cb => cb()) // ⑤
				PENDED_REQUTEST_QUEUE.length = 0 // 重置请求队列
			})
		}
		return new Promise(resolve => { // ⑥ 上述提到的，必须要return一个promise实例，此处用到了闭包，保存了resolve，使得后续依次执行PENDED_REQUTEST_QUEUE中保存的挂起的请求时，可以正常调用原始promise的resolve
			PENDED_REQUTEST_QUEUE.push(_ => { // ⑦
				resolve(__request(obj, config)) // ⑧
			})
		})
	}
	return __request(obj, config) // ⑨ token 未过期，正常发送请求
}

```

接下来解读一下上述①~⑨行代码：


①：从前端缓存中获取token

②：判断access_token是否处于有效期内（此处简单地通过前端判断，其实是不严谨的，但这不是本文的重点）

⑨：若②判断未过期，则执行第⑨步，正常调用封装的__request函数，正常发起请求

③：若②判断过期，再判断是否已经有正在请求token的request存在（避免多个请求判断token过期时都去刷新token，浪费资源）

④：如果上述③不成立，则发起请求获取新的token，然后执行⑥

⑥：上文提到过，无论如何我们都要return一个promise（先别管这个promise做了啥），才能保证原始请求被挂起，后续新的token回来时重发原始请求。

⑦：再看这个promise里面做了什么？为了保证原始请求重发，我们要用一个数组存储原始请求（按照原始请求的顺序）；Q1：原始请求是什么？很简单，就是文中的 __request(obj, config)；Q2：怎么存储原始请求呢？我们知道这个原始请求必须要等待一个信号（新的token请求回来了）才能发送，所以肯定不能是同步的代码，所以此处我们使用一个函数包裹原始请求，等到新的token回来后，执行这个函数（第⑤步）即可；那为什么要用resolve包裹原始请求呢？直接写成下述方式不行吗？


```
return new Promise(resolve => { 
     PENDED_REQUTEST_QUEUE.push( _ => {
                __request(obj, config)
                // 或者 return __request(obj, config) 
            })
        })
```
> 这里涉及promise的一个知识点，见如下demo：

```
  const p1 = new Promise(function(resolve, reject){
    setTimeout(()=>reject(new Error('fail')), 3000)
  })
  
  const p2 = new Promise(function(resolve, reject){
    setTimeout(()=>resolve(p1), 1000)
  })
  
  p2.then(result => console.log(result)).catch(error=> console.log(error))
  // Error: fail
```
>p1和p2都是Promise的实例，但是p2的resolve方法将p1作为参数，即一个异步操作的结果返回是另一个异步操作。

>**这个时候，p1的状态就会传递给p2，p1的状态决定了p2的状态。**

>p1的状态如果是pending，那么p2的回调函数then就会等待p1的状态改变。如果p1的状态已经是resolved或者rejected，那么p2的回调函数会马上执行。

>上面 p1 是一个Promise，3秒之后变为rejected。p2的状态在1秒之后改变，resolve方法返回的是p1。由于p2返回的是另一个Promise，导致p2自己的状态无效，由p1的状态决定p2的状态，所以后面then语句变成针对后者(p1)，又过了2秒，p1变为rejected，导致触发catch方法指定的回调函数。

利用上述特性，我们可以实现缓存原始请求并且将原始请求的结果正常返回给业务代码的需求。

⑤：获取到新的token之后，重发被挂起的原始请求，清空原始请求队列，至此核心功能实现。


### 第二步：token过期时获取新的token

```
// 获取新的access token
function __getAccessToken (refreshToken) {
	IS_REFRESH_TOKEN = true // 设置上述标志位，避免重复请求access_token
	let header = {
		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		"Authorization": `Basic ${btoa("cloud:cloud")}` // 此处为后端协商好的格式，因人而异
	}
	return new Promise((resolve, reject) => {
		http.request({
			url: `${config.baseUrl}oauth/token`,
			method: "POST",
			header,
			data: {
				"grant_type": "refresh_token",
				"refresh_token": refreshToken,
			},
			success: (res) => {
				if (res.statusCode === 200) {
					__setToken(res.data)
					resolve(true)
				} else {
					reject(false)
				}
			},
			error: () => {
				reject(false)
			},
			complete: () => {
				IS_REFRESH_TOKEN = false // 重置标志位
			}
		})
	})
}
```

### 第三步：公共的request方法
此方法因人而异，一个简单的基础http服务

```
function __request(obj, config){
	......
	// http 服务实现
	......
	return new Promise((resolve,reject)=>{
		// 发送http请求，成功调用resolve，失败调用reject
	})
}
```

### 第四步：对外暴露的http服务

```
function HTTP (obj, config = {}) {
	if (!config.isAllowAnonymous) { // 需要校验的请求走access_token逻辑
		return __requestWithToken(obj, config)
	}
	return __request(obj, config) // 不许校验的请求直接发送
}

export default {
	GET (url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "GET"
		}, config);
	},
	POST (url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "POST"
		}, config);
	},

	POSTForm (url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "POST",
			header: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			}
		}, config);
	}
}
```

## 参考链接

[什么是 JWT -- JSON WEB TOKEN](https://www.jianshu.com/p/576dbf44b2ae)

[10分钟了解JSON Web令牌（JWT）](https://baijiahao.baidu.com/s?id=1608021814182894637&wfr=spider&for=pc)

