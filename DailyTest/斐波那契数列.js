// 写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项。斐波那契数列的定义如下：
// F(0) = 0,   F(1) = 1
// F(N) = F(N - 1) + F(N - 2), 其中 N > 1


// 无脑简单递归做法：特别容易栈溢出，时间复杂度O(2^n)
// function fib (n) {
//     if (n <= 1) return n
//     return fib(n - 1) + fib(n - 2)
// }

// console.log(fib(2))



// 递归优化：存储计算过得值，如果已经计算过，则直接取出来，不再递归；空间复杂度O(n)/时间复杂度O(n)
// eg：f5 = f4 +f3 => f4=f3+f2,此时f3就无须再计算了
/**
 [备忘录]优点
 虽然备忘录用了 O(N)的空间。但是重复计算同个 f(n)的结果时候，时间复杂度是 O(1)。
 比如之前调用过一次Fibonacci(10)，那么 f(10)的结果就缓存在了 cache 中。再次调用函数，直接从缓存读取即可。 
 总结：备忘录缓存了计算结果，避免了多次调用时的重复计算。
 */
function fibCached (n) {
    let cachedData = new Map()
    function fib (n) {
        if (cachedData.has(n)) return cachedData.get(n)
        else {
            if (n <= 1) { cachedData.set(n, n); return n }
            else {
                cachedData.set(n - 1, fib(n - 1))
                cachedData.set(n - 2, fib(n - 2))
                return fib(n - 1) + fib(n - 2)
            }
        }
    }
    return fib(n)
}

console.log(fibCached(7))

// 尾递归优化：减少调用栈
// eg: f(4) = f(3,f(1),f(2)) = f(2,f(2),f(3)) = f(1, f(3), f(4)) => f(4)  前后呼应，说明算法有效
function betterFib (n, fn1Val = 1, fn2Val = 1) {
    if (n <= 1) return fn2Val
    return betterFib(n - 1, fn2Val, fn1Val + fn2Val)
}


// 使用循环代替递归，减少调用栈
function trampoline (f) {
    while (f && f instanceof Function) {
        f = f();
    }
    return f;
}

function loopFib (n) {
    if (n <= 1) return 1
    return loopFib.call(undefined, n)
}

loopFactory()


// 使用while循环：时间复杂度O(n)/空间复杂度O(n)
// 分析斐波那契数列的特点：1，1，2，3，5，8，13，
// 转换为数组：【1，1，2，3，5，8，13...】
function whileFib(n){
    let arr = new Array(n)
    arr[0]=arr[1]=1
    for(let i=2;i<n+1;i++){
        arr[i]=arr[i-2]+arr[i-1]
    }
    return arr[n]
}

// 还能不能继续优化？
// 我们发现其实每次只需要前两个值即可，所以空间复杂度还可以继续降低为O(n)
function betterWhileFib(n){
    let val1=1,val2=1,valTemp,i=2
    if(n<2) return 1
    while(i<n){
        valTemp = val2
        val2 = val1 + val2
        val1 = valTemp
        i++
    }
    return val1+val2
}

console.log(betterWhileFib(600)===whileFib(600))

