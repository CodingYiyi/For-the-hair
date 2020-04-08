// 给定一个十进制数字，输出对应的二进制数字 eg：10 => 1010
// 栈实现（压栈操作）
function toBinary(num){
    let resArr = []
    while(num>0){
        resArr.unshift(num%2)
        // 正整数向下取整的几种方式
        num = Math.floor(num/2)
        // num = parseInt(num/2)
        // // js数值都是由64位浮点型表示的，当进行位运算的时候，会自动转换为32为有符号的整数，并舍弃小数位。所以就可以实现向下取整了。(所以只能针对正整数)
        // num = (num/2 | 0)
        // num = (num/2 >> 0)
    }
    return resArr.join("")
}
var testNum = 11
console.log(toBinary(testNum)  === testNum.toString(2))

// 递归实现
function toBinary2(n){

}
