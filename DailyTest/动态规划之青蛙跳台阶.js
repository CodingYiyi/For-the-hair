// 一只青蛙一次可以跳上 1 级台阶，也可以跳上 2 级。求该青蛙跳上一个 n 级的台阶总共有多少种跳法（先后次序不同算不同的结果）
// 假设跳到 n 级台阶有 f(n)种方法。根据题目，青蛙在跳上 n 级时有 2 种方法：
// 从 n - 1 级跳 1 级上来
// 从 n - 2 级跳 2 级上来
// 青蛙跳到 n- 1 级有 f(n-1)种方法，跳到 n- 2 级有 f(n-2)种方法。所以 f(n) = f(n - 1) + f(n - 2)。这就是斐波那契数列的定义式。
function jumpStep (n) {
    if (n <= 1) return n
    return jumpStep(n - 1) + jumpStep(n - 2)
}
console.log(jumpStep(7))


// 进阶：一只青蛙一次可以跳上 1 级台阶，也可以跳上 2 级……它也可以跳上 n 级。求该青蛙跳上一个 n 级的台阶总共有多少种跳法。
/**
假设跳 n 级台阶的跳法数量是 f(n)个。

那么根据题意，青蛙可能从 n-1 级直接跳上来，也可能从 n-2 级直接跳上来，依次类推：f(n) = f(n - 1) + f(n - 2) + ... + f(1)

同理：f(n - 1) = f(n - 2) + f(n - 3) + ... + f(1)

所以，将公式 1 中的f(n - 2) + f(n - 3) + ... + f(1)替换为f(n - 1)。公式 1 变为：f(n) = f(n - 1) + f(n - 1) = f(n - 1) * 2 （公式 3）

同理：f(n - 1) = f(n - 2) + f(n - 2) = f(n - 2) * 2（公式 4）

结合公式 3 和公式 4: f(n) = f(n - 2) * 2 * 2。因此可以推出：f(n) = 2^(n - 1)
*/
function advancedJump (n) {
    return Math.pow(2, n - 1)
}


// 斐波那契数列尾递归优化：减少调用栈信息
function betterFib (n, act1 = 1, act2 = 1) {
    if (n <= 1) return act2
    return betterFib(n - 1, act2, act1 + act2)
}
console.log(betterFib(100))

// 使用数组存储，代替递归
function arrayFib (n) {
    let array = [1, 2]
    for (let i = 2; i < n; i++) {
        array[i]=array[i-1]+array[i-2]
    }
    return array.pop()
}
console.log(arrayFib(100))
