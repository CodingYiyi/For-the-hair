// m个人依次数数，每次数到n的那个人退出，后面的人重新从1开始数，最后剩下谁？
// 1,2,3,4,5 每次数到3退出 1，2，4，5，=》2,4,5=》2,4》4
// 题目解析：根据游戏规则，利用队列的特性，每次数到不是n的数字，将此数字放置队列的末尾，遇到n则推出。
function jiguchuanhua(n,m){
    let arr = [...m]
    let i = 1;
    while(arr.length>1){
        if(i!=n){
            arr.push(arr.shift()) // 把前面的项目放到数组尾部
            i++
        }else{
            arr.shift()
            i=1
        }
    }
    return arr[0]
}

console.log(jiguchuanhua(3,[1,2,3,4,5]))
console.log(jiguchuanhua(3,[5,4,3,2,1]))
