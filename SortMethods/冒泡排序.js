// https://www.runoob.com/w3cnote/bubble-sort.html

/** 
 冒泡排序思路：相邻两个元素进行比较，大的放在后面，每次循环产生一个最大值，时间复杂度O(n^2)
 冒泡排序优化：
 1. 在经历一论内层循环后，如果所有的元素位置都没有发生变化，那么说明数组已经有序
 2. 可能数组的某个区间已经有序，所以内层循环的终点不应单纯设置为 num.length -i -1，会浪费一些无效的对比；记录每次循环后最后一次交换位置的下标，作为内层循环的终点
 总结：优化归优化，时间复杂度仍旧是 O(n^2)
 */

function bubbleSort (arr) {
    for (let i = 0; i < arr.length; i++) {
        let sorted = true
        let rightBorder = arr.length - 1
        for (let j = 0; j < rightBorder; j++) {
            if(arr[j]>arr[j+1]){
                sorted = false
                // [arr[j],arr[j+1]]=[arr[j+1],arr[j]] //注意：错误代码！！！不能对常量进行此方式的值交换
                let temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
                rightBorder = j // 更新下一次的内层循环的终点
            }
        }
        if(sorted) {
            console.log("外层循环次数：",i)
            break
        }
    }
    return arr
}


var testArr = [3,4,2,1,5,6,7,8]

console.log(bubbleSort(testArr))