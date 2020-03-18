// 在一个二维数组中（每个一维数组的长度相同），每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。
// 请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

var arr = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
]

var target = 0

/**
 * 时间复杂度O(m+n)，使用了临时变量数组，故空间复杂度O(n)
 * @param {*} arr m行*n列
 * @param {*} target 
 */
function findNumIn2DArray (arr, target) {
    let targetArray
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].slice(-1) >= target) {
            targetArray = arr[i]
            break;
        }
    }
    return { i: i, j: targetArray.indexOf(target) }
}

/**
 * 降低空间复杂度为O(1)
 * @param {*} arr 
 * @param {*} target 
 */
function findNumIn2DArray (arr, target) {
    let row = arr.length, col = arr[0].length
    let i = 0, j = 0
    while (i < row) {
        if (arr[i].slice(-1) >= target) {
            while (j < col) {
                if (arr[i][j] === target) return { row: i, col: j }
                else {
                    j++
                }
            }
            return false
        } else {
            i++
        }
    }
    return false
}

console.log(findNumIn2DArray(arr, target))


// 参考答案
// ac地址：https://leetcode-cn.com/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/
// 原文地址：https://xxoo521.com/2019-12-19-er-wei-shu-zu-cha-zhao/
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var findNumberIn2DArray = function(matrix, target) {
    const rowNum = matrix.length;
    if (!rowNum) {
        return false;
    }
    const colNum = matrix[0].length;
    if (!colNum) {
        return false;
    }

    let row = 0,
        col = colNum - 1;
    while (row < rowNum && col >= 0) {
        if (matrix[row][col] === target) {
            return true;
        } else if (matrix[row][col] > target) {
            --col;
        } else {
            ++row;
        }
    }

    return false;
};