// https://www.runoob.com/w3cnote/quick-sort-2.html

/**
快速排序的基本思想：通过一趟排序将待排记录分隔成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，则可分别对这两部分记录继续进行排序，以达到整个序列有序。

快速排序使用分治法来把一个串（list）分为两个子串（sub-lists）。具体算法描述如下：
从数列中挑出一个元素，称为 “基准”（pivot）；
重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区（partition）操作；
递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。
 */

// 双指针递归实现
function fastSort1 (arr) {
    if (arr.length <= 1) return arr //递归结束条件
    let leftPoint = 0, rightPoint = arr.length - 1, base = arr[0] // 取第一个元素为基准元素
    while (rightPoint > leftPoint) {
        while (arr[rightPoint] > base && rightPoint > 0) rightPoint-- // 移动右指针，知道遇到一个比基准元素小的，停下
        while (arr[leftPoint] <= base && leftPoint < arr.length - 1) leftPoint++ // 移动左指针，直到遇到一个比基准元素大的停下
        if (rightPoint > leftPoint) { // 判断右指针是否大于左指针，处理两个指针相遇的情况（此时右指针指向一个小于base的数，左指针指向一个大于base的数）
            let temp = arr[rightPoint]
            arr[rightPoint] = arr[leftPoint]
            arr[leftPoint] = temp
        }
    }
    if (arr[rightPoint] < base) { // 把基准元素跟右指针的数据交换
        let temp = arr[rightPoint]
        arr[rightPoint] = arr[0]
        arr[0] = temp
    }
    return [...fastSort1(arr.slice(0, leftPoint)), ...fastSort1(arr.slice(leftPoint, arr.length))]
}

// 单指针递归实现
function fastSort2 (arr) {
    if (arr.length <= 1) return arr //递归结束条件
    let point = 0, base = arr[0] // point记录的是小于基准数的个数，base为基准数，默认第一项
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < base) {  //遇到一个比基准数小的，则基准数个数+1，第一个比基准数大的值和当前遇到的比基准数小的值交换
            point++
            if (arr[point] > arr[i]) {  // 避免自己跟自己交换的情况
                let temp = arr[point]
                arr[point] = arr[i]
                arr[i] = temp
            }
        }
    }
    // 数组遍历完一次，将数组第一个元素（也就是基准数）和此轮循环遇到的最后一个比基准数小的数交换位置
    arr[0] = arr[point]
    arr[point] = base
    return [...fastSort2(arr.slice(0, point + 1)), ...fastSort2(arr.slice(point + 1, arr.length))] // 递归处理，每次至少让数组个数-1（point+1的作用），避免死循环
}

// 数组代替递归
function fastSort3 (arr) {
    var stack = [arr], res = []
    while (stack.length > 0) {
        let data = stack.pop()
        if (data.length > 1) {
            let point = 0, base = data[0] // point记录的是小于基准数的个数，base为基准数，默认第一项
            for (let i = 0; i < data.length; i++) {
                if (data[i] < base) {  //遇到一个比基准数小的，则基准数个数+1，第一个比基准数大的值和当前遇到的比基准数小的值交换
                    point++
                    if (data[point] > data[i]) {  // 避免自己跟自己交换的情况
                        let temp = data[point]
                        data[point] = data[i]
                        data[i] = temp
                    }
                }
            }
            // 数组遍历完一次，将数组第一个元素（也就是基准数）和此轮循环遇到的最后一个比基准数小的数交换位置
            data[0] = data[point]
            data[point] = base
            stack.push(data.slice(point + 1, data.length),data.slice(0, point + 1))
        }else{
            res.push(...data)
        }
    }
    return res
}

// var testArr = [4, 7, 6, 5, 3, 2, 8, 1]
var  testArr=[8,7,6,5,4,3,2,1]
// console.log(fastSort1(testArr))
// console.log(fastSort2(testArr))
console.log(fastSort3(testArr))
