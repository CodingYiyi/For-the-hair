/**
给定 n 个非负整数(n>2)表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
示例:
输入: [0,1,0,2,1,0,1,3,2,1,2,1]
输出: 6

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/trapping-rain-water
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
*/

// 题目分析：盛水量 = ∑(H-itemH)*1
// 问题转化为怎么求H的问题，给定一个位置i，这个位置可以盛水，必须满足该位置左右两端都存在比其高的柱子，
// 且该位置i（纵向分析）的盛水量为 Math.min(左端最高柱子，右端最高柱子)-item[i].height
// 依次遍历数组，累计即可，问题的关键在于求解左边柱子最大值和右边柱子最大值,
// 我们其实可以用两个数组来表示leftMax, rightMax，
// 以leftMax为例，leftMax[i]代表i的左侧柱子的最大值，因此我们维护两个数组即可。

// 关键点解析
// 建模 h[i] = Math.min(左边柱子最大值, 右边柱子最大值)(h为下雨之后的水位)
// 时间复杂度O(n)、空间复杂度O(n)

function trap (arr) {
    let leftArr = [], rightArr = []
    let maxLeftH = arr[0], maxRightH = arr[arr.length - 1]
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        maxLeftH = Math.max(maxLeftH, item)
        leftArr[i] = maxLeftH
    }
    for (let j = arr.length - 1; j >= 0; j--) {
        let item = arr[j]
        maxRightH = Math.max(maxRightH, item)
        rightArr[j] = maxRightH
    }
    for (let k = 0; k < arr.length; k++) {
        let item = arr[k]
        sum += (Math.min(leftArr[k], rightArr[k]) - item)
    }
    return sum
}

var testArr = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
console.log(trap(testArr))

// TODO：使用双指针优化，空间复杂度降为O(1)