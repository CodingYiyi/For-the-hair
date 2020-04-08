/**
 * 给定n个正整数数列[a1,a2,a3,……an]和一个整数M
 * 要求在该数列中找到一个连续的子区间，下标为[i,j]，使得ai + …… + aj的值在不超过M的情况下最大
 * 若有多个符合条件的区间，输出i最小的那个
 * eg：输入[2,3,4,5,6],10,
 * 输出[0,2]
 */

//  双层for循环，暴力很，时间复杂度O(n^2)
function getClosestPart (arr, M) {
    var ansI = 0, ansJ = 0, max = 0
    outer:
    for (let i = 0; i < arr.length; i++) {
        let sum = arr[i]
        inner: //内层for循环标识
        for (let j = i + 1; j < arr.length; j++) {
            let item = arr[j]
            sum += item
            if (sum < M && sum > max) { //更新目前已知的最大值和其集合区间下标
                ansI = i
                ansJ = j
                max = sum
            } else {
                break inner // 跳出内层for循环
            }
        }
    }
    console.log(ansI, ansJ, max)
}


// 二分法思想
// 已知s[i]=s[i-1]+item[i]，则s[i,j] = s[j]-s[i-1]
// 给定一个左下标i，那么肯定存在一个j，使得s[i,j]<M<s[i,j+1]，这个j就是我们想要得到的下标，
// 问题就简化为：如何可以在i确定的情况下，更快地找到j，注意s是递增的，所以这个题就可以转化为有序数组查找一个值的问题，可以应用二分法查找
function getClosestPart (arr, M) {
    var ansI = 0, ansJ = 0, sumArr = [], max = 0
    for (let i = 0; i < arr.length; i++) { // 获取[0,i]总和的集合
        sumArr.push(sum += arr[i])
    }
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        let leftIndex = i + 1, rightIndex = arr.length
        // 二分法查找j的值，满足s[i,j]<M<s[i,j+1]
        while(leftIndex<rightIndex){
            let sumR = sumArr[rightIndex]-sumArr[leftIndex]
            let sumL = sumArr[rightIndex]-sumArr[leftIndex+1]
            if(<M)
        }
    }
}

var testArr = [5, 6, 4, 4, 5, 8, 9, 1, 2, 7], M = 8
getClosestPart(testArr, M)