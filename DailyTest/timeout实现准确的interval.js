/**
 通常情况下使用如果我们有定时器的需求，通常会使用 setInterval 的 写法，但是它有个问题: 时间间隔不准确，
 为什么说不准确呢？因为js单线程时间循环机制的存在，异步操作必须要等待同步操作完成后才能执行，那么同步操作的时间又是不可控制的（可能有个很庞大的for循环）
 因为setInterval的回调函数并不是到时后立即执行,而是等系统计算资源空闲下来后才会执行.
 而下一次触发时间则是在setInterval回调函数执行完毕之后才开始计时（<-- 重点）
 所以如果setInterval内执行的计算过于耗时,或者有其他耗时任务在执行,setInterval的计时会越来越不准,延迟很厉害
 */

// var startTime = new Date().getTime()
// var count = 0;;
// setInterval(function () {
//     var start = new Date().getTime()
//     while(new Date().getTime()-start < 600){
//         // 一个消耗600s的逻辑
//     }
//     count++;
//     console.log(new Date().getTime() - (startTime + count * 1000)); // 正常来讲这个值应该是0（或者是一个很小的数字）
// }, 1000);

// 实际输出结果如下：
// 600
// 601
// 1208
// 1808
// 2408
// 3008

/**
 * 针对这种情况，我们可以想办法动态抹平下时间差，也就是说下一次的interval不是固定的，而是基于上一次的执行时间和interval的差
 */

function smartInterval(fn, ms) {
    var fixedInterval = ms
    function interval(time) {
        return setTimeout(() => {
            var last = new Date().getTime()
            fn.call(null)
            var offset = last + fixedInterval - new Date().getTime(); // 下次间隔时间为动态计算，即：指定的间隔减去fn执行时间
            var nextTime = Math.max(offset, 0);
            interval(nextTime)
        }, time)
    }
    return interval(ms)
}

smartInterval(() => {
    var start = new Date().getTime()
    while (new Date().getTime() - start < 600) {
        // 一个消耗600s的逻辑
    }
    console.log("end:", new Date().getTime())
}, 1000)


// 上述情况只考虑了 fn 的执行时间，没有考虑外部因素，并且 chrome 环境下的setInterval可以实现上述功能，node环境下不稳定
// 扩展：如何将外部环境的执行情况也考虑进去呢？例如同步阻塞的逻辑没有写在fn中，而是在外部，上述函数就显得有点鸡肋了。

function betterInterval(fn, ms) {
    var fixedInterval = ms, start = new Date().getTime(), count = 0
    this.timer = undefined
    this.interval = function(time) {
        this.timer = setTimeout(() => {
            fn.call(null)
            var offset = new Date().getTime() - (start + ++count * fixedInterval);
            var nextTime = Math.max(fixedInterval - offset, 0)
            this.interval(nextTime)
        }, time)
    }
    this.interval(ms)
}
betterInterval.prototype.stop = function(){
    console.log(this.timer)
    clearTimeout(this.timer)
}

setInterval(function () {
    var start = new Date().getTime()
    while (new Date().getTime() - start < 1000 * Math.random());
}, 0);

var t = new betterInterval(() => {
    console.log("end:", new Date().getTime())
}, 1000)

// 需要停止的时候调用 t.stop()
