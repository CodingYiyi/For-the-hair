// 实现一个debounce函数，接受一个函数和数字（时间间隔），返回一个函数
// 支持函数外取消定时器
function debounce(func,wait){
    var timer = null
    var res = function(){
        timer && res.cancel() // 如有一个等待执行的函数且还未被执行，清除这个事件，重新计时
        let args = [].slice.call(arguments) // 函数参数
        timer = setTimeout(function(){
            func.apply(args.shift(),args)
        },wait)
    }
    res.cancel = function(){
        timer && clearTimeout(timer)
        timer = null
    }
    return res
}

var testF = function(n){
    console.log("trigger！！！",n)
}

var resF = debounce(testF,10000)
resF(undefined,1)


// 实现一个throttle函数，接受一个函数和数字（时间间隔），返回一个函数
// 第一次会执行，以后时隔interval触发一次，最后再执行一次
function throttle(func,interval){
    var timer,previous=0
    var res = function(){
        let args = [].slice.call(arguments) // 函数参数
        if(new Date().getTime()-previous>interval){ //判断距离上次执行时间是否达到时间间隔
            previous = new Date().getTime()
            func.apply(args.shift(),args.slice(1))
        }else{
            timer && clearTimeout(timer)
            timer = setTimeout(function(){
                func.apply(args.shift(),args.slice(1))
            },interval)
        }
    }
    return res
}

var throttleF = throttle(function(){
    console.log(new Date())
},3000) 
window.addEventListener("mousemove",throttleF)


// 闭包和this
var a = 1
function f1(){
    var a = 2;
    function f(){
        console.log(a)
        console.log(this.a)
    }
    return f
}

var resF = f1()
resF() // 先打印2，再打印1