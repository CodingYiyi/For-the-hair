// https://juejin.im/post/5d5ccdd75188255625591357
// https://juejin.im/post/5dcac7686fb9a04a9e37b595

// console.log(new Date().getTime())

// let requestPromise
// var request = function(){
//     requestPromise =  new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             resolve("模拟3秒后返回数据")
//         },3000)
//     })
//     return requestPromise
// }

// var p =  new Promise((resolve,reject)=>{
//     let p2 = new Promise((resolve,reject)=>{
//         setTimeout(_=>{
//             reject("123")
//         },3000)
//     })
//     resolve(p2)
// })

// p.then(res=>{
//     console.log(res)
// }).catch(err=>[
//     console.error(err)
// ])


// var original = Promise.resolve(33);
// var cast = Promise.resolve(original);
// cast.then(function(value) {
//   console.log('value: ' + value);
// });
// console.log('original === cast ? ' + (original === cast));

/*
*  打印顺序如下，这里有一个同步异步先后执行的区别
*  original === cast ? true
*  value: 33
*/


Promise.resolve("foo")
    // 1. 接收 "foo" 并与 "bar" 拼接，并将其结果做为下一个 resolve 返回。
    .then(function (string) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                string += 'bar';
                resolve(string);
            }, 1);
        });
    })
    // 2. 接收 "foobar", 放入一个异步函数中处理该字符串
    // 并将其打印到控制台中, 但是不将处理后的字符串返回到下一个。
    .then(function (string) {
        setTimeout(function () {
            string += 'baz';
            console.log(string);
        }, 1)
        return string;
    })
    // 3. 打印本节中代码将如何运行的帮助消息，
    // 字符串实际上是由上一个回调函数之前的那块异步代码处理的。
    .then(function (string) {
        console.log("Last Then:  oops... didn't bother to instantiate and return " +
            "a promise in the prior then so the sequence may be a bit " +
            "surprising");

        // 注意 `string` 这时不会存在 'baz'。
        // 因为这是发生在我们通过setTimeout模拟的异步函数中。
        console.log(string);
    });


Promise.resolve(1).then(res => {
    console.log("res1", res)
    return 11
}).then(console.log(2)).then(res3 => {
    console.log("res3", res3)
    return Promise.resolve(3)
}).then(res4 => {
    console.log("res4", res4)
})
console.log("haha")

Promise.resolve('foo1')
    .then(res => {
        Promise.resolve('foo2')
    })
    .then(function (result) {
        console.log(result) // 输出的结果为 foo
    })


var p2 = new Promise(function (resolve, reject) {
    resolve(1);
});

p2.then(function (value) {
    console.log("first:", value); // 1
    return value + 1;
}).then(function (value) {
    console.log(value + ' - A synchronous value works');
});

p2.then(function (value) {
    console.log("second", value); // 1
});
console.log("同步逻辑")


var p = new Promise((resolve,reject)=>{
    setTimeout(_=>{
        resolve("123")
        // return Promise.resolve("124")
        // return 123
    },3000)
})

p.then(res=>{
    console.log(res)
    return res
}).then()