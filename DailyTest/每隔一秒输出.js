// setTimeout与循环闭包的经典面试题
// 输出五个5
for (var i = 0; i < 5; i++) {
    setTimeout(function timer () {
        console.log(i);
    }, i * 1000);
}

// 使用settimeout的第三个参数
for (var i = 0; i < 5; i++) {
    setTimeout(function timer (i) {
        console.log(i);
    }, i * 1000, i);
}


// 使用 let 实现
for (let i = 0; i < 5; i++) {
    setTimeout(function timer () {
        console.log(i)
    }, i * 1000)
}

// 使用闭包实现
for (var i = 0; i < 5; i++) {
    !function (i) {
        setTimeout(function () {
            console.log(i)
        }, i * 1000)
    }(i)
}

// 借助 async 和 await
async function test () {
    for (var i = 0; i < 5; i++) {
        let data = await new Promise(resolve => {
            setTimeout(() => {
                resolve(i)
            }, 100)
        })
        console.log(data)
    }
}

test()