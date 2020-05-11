// https://www.runoob.com/w3cnote/insertion-sort.html
/**
算法步骤
将第一待排序序列第一个元素看做一个有序序列，把第二个元素到最后一个元素当成是未排序序列。
从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置。（如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面。）
 */

function insertSort (arr) {
    var l = arr.length, current
    for (var i = 1; i < l; i++) {
        var pre = i - 1, current = arr[i] // 每次循环记录当前比较的值和前一个值的下标（默认i-1，while中会更改）
        while (pre >= 0 && current < arr[pre]) { // 如果当前值比前面的值小，则将前面的值与当前值交换位置，每次交换完后，pre--，再与前面的值比较，直到遇到一个更小的值，放在该值后面
            arr[pre+1] = arr[pre] //注意这里要用 pre+1 而不能简单地使用i，因为在一个循环里i是不变的，而我们要依次向前比较，所以要用 pre+1 代替
            arr[pre] = current
            pre--
        }
    }
    return arr
}

var testArr = [3, 4, 2, 1, 5, 6, 7, 8]
console.log(insertSort(testArr))