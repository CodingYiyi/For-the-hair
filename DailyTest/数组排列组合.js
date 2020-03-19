// 输入一个一维数组如[1,2,3]，无重复，输出其排列组合
function permAndComb (arr, string) {
    if (arr.length > 1) {
        for (let i = 0; i < arr.length; i++) {
            let copyArr = [...arr]
            copyArr.splice(i, 1)
            permAndComb(copyArr, string + arr[i])
        }
    } else results.push(string + arr[0])
}

var results = []
var data = ["a", "b", "c", "d"]

permAndComb(data, '')
console.log(results)


// 输入一个二维数组，返回其排列组合
/**
    [
        [1,2,3],
        ["a","b"],
        ["hei","ha"]
    ]
=>  1ahei/1aha/1bhei/1bha 等等……
 */


function permAndComb2 (arr, string) {
    if (arr.length > 1) {
        var top = arr.slice(0,1)[0]
        for(let i=0;i<top.length;i++){
            permAndComb2(arr.slice(1), string+top[i])
        }
    } else {
        for (let i = 0; i < arr[0].length; i++) {
            results.push(string + arr[0][i])
        }
    }
}

var data = [
    [1, 2, 3],
    ["a", "b"],
    ["hei", "ha"]
]

var results = []

permAndComb2(data, "")
console.log(results)