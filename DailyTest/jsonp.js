// 跨域解决方法之 jsonp 的实现
// jsonp 实现跨域的原理：首先要清楚认识的一点是，跨域不是服务器端做的限制，而是浏览器端出于用户信息安全做的限制
// 除了 协议，域名，端口不一样会导致跨域以外，域名和对应的ip之间的请求也算跨域 eg. http://abc.com/a.js  请求 abc.com 对应的ip地址 89.123.54.13下的接口也会构成跨域
// 尽管浏览器有同源策略，但是 <script> <img> 便签的 src 属性不会被同源策略所约束，可以获取任意服务器删的脚本并执行
// jsonp 通过插入 script 标签的方式来实现跨域，参数只能通过 url 传入，仅能支持 get 请求。

function jsonp(url,params,callback){
    return new Promise((resolve,reject)=>{
        var scriptTag = document.createElement("script") // 创建 script 标签
        window[callback]=function(data){ // 关键：在window 对象上挂在全局回调函数（不用单独在外面写了）
            resolve(data) // 处理请求回来的数据
            document.body.removeChild(scriptTag) // 闭包获取jsonp创建的script标签，并移除掉
        }
        var queryParamsArray = []
        Object.keys(params).forEach(key=>{
            queryParamsArray.push(`${key}=${encodeURIComponent(params[key])}`)
        })
        scriptTag.src = url+'?'+queryParamsArray.join("&")+'&callback='+callback
        document.body.appendChild(scriptTag)
    })
}

// http://192.168.16.90/auth/oauth/token?_allow_anonymous=true&username=admin&password=0234337e1e9dae1a3329d7ccf8b89662&grant_type=password
jsonp("http://192.168.16.90/auth/oauth/token",{
    _allow_anonymous:true,
    username:"admin",
    password:"0234337e1e9dae1a3329d7ccf8b89662",
    grant_type:"password"
},"callbackFunc").then(res=>{
    console.log(res) // 上述 resolve 函数的参数，即后台返回的数据
})

// 后台接受到请求后返回js文件内容如下：
// callbackFunc("这里是具体的数据")