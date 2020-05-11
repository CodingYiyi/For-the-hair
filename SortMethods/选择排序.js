// https://www.runoob.com/w3cnote/selection-sort.html

/**
算法步骤
首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置。
再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
重复第二步，直到所有元素均排序完毕。
 */

function selectSort(arr){
    let l = arr.length
    let minIndex // 最小数下标
    for(var i=0;i<l;i++){
        minIndex = i
        for(var j=i+1;j<l;j++){
            if(arr[j]<arr[minIndex]) { // 遇到一个更小的数
                minIndex = j // 更新最小数下标
            }
        }
        // 每次for循环完后，就会得到一个当前未排序区间的最小数下标，然后与该区间的第一个数交换位置，则有序区间长度+1、无序区间长度-1
        let temp = arr[minIndex]
        arr[minIndex] =  arr[i]
        arr[i]= temp
    }
    return arr
}

var testArr = [3,4,2,1,5,6,7,8]
console.log(selectSort(testArr))