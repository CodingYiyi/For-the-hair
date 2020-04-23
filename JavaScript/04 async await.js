var resolveAfter2Seconds = function () {
    console.log("starting slow promise");
    return new Promise(resolve => {
        setTimeout(function () {
            resolve("slow");
            console.log("slow promise is done");
        }, 2000);
    });
};

var resolveAfter1Second = function () {
    console.log("starting fast promise");
    return new Promise(resolve => {
        setTimeout(function () {
            resolve("fast");
            console.log("fast promise is done");
        }, 1000);
    });
};

var sequentialStart = async function () {
    console.log('==SEQUENTIAL START==');

    // 1. Execution gets here almost instantly
    const slow = await resolveAfter2Seconds();
    console.log(slow); // 2. this runs 2 seconds after 1.

    const fast = await resolveAfter1Second();
    console.log(fast); // 3. this runs 3 seconds after 1.
}

var concurrentStart = async function () {
    console.log('==CONCURRENT START with await==');
    const slow = resolveAfter2Seconds(); // starts timer immediately
    const fast = resolveAfter1Second(); // starts timer immediately

    // 1. Execution gets here almost instantly
    console.log(await slow); // 2. this runs 2 seconds after 1.
    console.log(await fast); // 3. this runs 2 seconds after 1., immediately after 2., since fast is already resolved
}

var concurrentPromise = function () {
    console.log('==CONCURRENT START with Promise.all==');
    return Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then((messages) => {
        console.log(messages[0]); // slow
        console.log(messages[1]); // fast
    });
}

var parallel = async function () {
    console.log('==PARALLEL with await Promise.all==');

    // Start 2 "jobs" in parallel and wait for both of them to complete
    await Promise.all([
        (async () => console.log(await resolveAfter2Seconds()))(),
        (async () => console.log(await resolveAfter1Second()))()
    ]);
}

// This function does not handle errors. See warning below!
var parallelPromise = function () {
    console.log('==PARALLEL with Promise.then==');
    resolveAfter2Seconds().then((message) => console.log(message));
    resolveAfter1Second().then((message) => console.log(message));
}

//   sequentialStart(); // after 2 seconds, logs "slow", then after 1 more second, "fast"

//   // wait above to finish
//   setTimeout(concurrentStart, 4000); // after 2 seconds, logs "slow" and then "fast"

//   // wait again
//   setTimeout(concurrentPromise, 7000); // same as concurrentStart

//   // wait again
//   setTimeout(parallel, 10000); // truly parallel: after 1 second, logs "fast", then after 1 more second, "slow"

//   // wait again
//   setTimeout(parallelPromise, 13000); // same as parallel


parallel()


/**
 * await and parallelism(并行)
在sequentialStart中，程序在第一个await停留了2秒，然后又在第二个await停留了1秒。直到第一个计时器结束后，第二个计时器才被创建。程序需要3秒执行完毕。


在 concurrentStart中，两个计时器被同时创建，然后执行await。这两个计时器同时运行，这意味着程序完成运行只需要2秒，而不是3秒,即最慢的计时器的时间。

但是 await 仍旧是顺序执行的，第二个 await 还是得等待第一个执行完。在这个例子中，这使得先运行结束的输出出现在最慢的输出之后。

如果你希望并行执行两个或更多的任务，你必须像在parallel中一样使用await Promise.all([job1(), job2()])。
 */

// Q1：
async function gen () {
    let a = await Promise.resolve(1)
    console.log("a", a)
    // let b = await console.log("bbb") // 等价于 await new Promise(resolve=>resolve(console.log("bbb")))
    let b = await new Promise(resolve => resolve(console.log("bbb")))
    console.log("b", b)
    let c = await 3
    console.log("c", c)
}

setTimeout(_ => { console.log(5) }, 0)
gen()
console.log(111)
Promise.resolve(1).then(e => { console.log(6); return Promise.resolve(55) }).then(e => { console.log(7) })


// Q2
let p1 = Promise.resolve(1)
let p2 = new Promise(resolve => {
    setTimeout(() => {
        console.log("p22")
        // resolve(2)
        reject(2)
    }, 1000)
    // return resolve("p2")
})
async function fn () {
    console.log(1)
    // 当代码执行到此行（先把此行），构建一个异步的微任务
    // 等待promise返回结果，并且await下面的代码也都被列到任务队列中
    let result1 = await p2 // p2 必须要 resolve 才会执行下面的代码，reject都不行！
    console.log("p2", result1)
    console.log(3)
    let result2 = await p1
    console.log("p1", result2)
    console.log(4)
}
fn()
console.log(2)

// Q3
console.log(1)
setTimeout(() => { console.log(2) }, 1000)
async function fn () {
    console.log(3)
    setTimeout(() => { console.log(4) }, 20)
    return Promise.resolve(999)
}
async function run () {
    console.log(5)
    await fn()
    console.log(6)
}
run()
//需要执行150ms左右
for (let i = 0; i < 90000000; i++) { }
setTimeout(() => {
    console.log(7)
    new Promise(resolve => {
        console.log(8)
        resolve()
    }).then(() => { console.log(9) })
}, 0)
console.log(10)
// 1 5 3 10 4 7 8 9 2

// if you plan to call the 「then」function,you must return a promise object,
// cause a funciton default return [undefined] unless you declare the return value
function testPromise () {
    return new Promise((resolve, reject) => {
        // let random = Math.random()
        // if(random>0.5){
        //     setTimeout(_=>{resolve("resolved")},1000)
        // }else{
        //     setTimeout(_=>{reject("rejected")},1000)
        // }
        setTimeout(_ => { reject("rejected") }, 1000)
    })
}
// https://www.jianshu.com/p/614c2a7ca7fc
// reject后的东西，一定会进入then中的第二个回调，如果then中没有写第二个回调，则进入catch
testPromise().then(res => {
    console.log(res)
}, err => { // 若不指定 then 的第二个参数，则 testPromise 中的 reject 会被 下一个 catch 所捕获
    console.log(err)
    // return Promise.reject("returned reject") // 被下一个catch捕获
    return Promise.resolve("returned resolve") // 被下一个catch捕获
}).catch(e => { // catch 方法返回值为 promise 对象，即后续的then方法仍会继续执行，等价于 Promise.prototype.then(undefined, onRejected)
    // 如果 onRejected 抛出一个错误或返回一个本身失败的 Promise ， 通过 catch() 返回的Promise 被 rejected；否则，它将显示为成功（resolved）。 
    console.log("catched!!!", e)
    // return Promise.resolve("after catched, return 1")
}).then(res => {
    console.log(res)
}).then(_ => {
    console.log(1111)
})

function testPromise () {
    return new Promise((resolve, reject) => {
        setTimeout(_ => { resolve("resolved") }, 1000)
    })
}


testPromise().then(res1=>{
    console.log("res1:",res1)
    // return 111 // 等价于 return Promise.resolve(111)
    return Promise.resolve(111)
}).then(res2=>{
    console.log("res2:",res2)
})



// var test = function(a) {
//     var a = 1
//     return function (b) {
//         return a + b
//     }(function (a,b) {
//         return a
//     }(1,2))};

//     console.log(test(6))


// !function (a) {
//         console.log(a)
//     }(1,2)