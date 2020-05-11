/**
 * 鸡尾酒排序是冒泡排序的一个变种：
 * 考虑以下数组:[2,3,4,5,6,7,1,8]，为了将 1 移动到初始位置，外层循环依旧需要执行7次
 * 针对这种特殊的情况，可以将外层循环的次数改为数组长度的一半，然后内层循环写两个逻辑，分别产生一个最大值和一个最小值
 * 则上述情况外层循环只需要执行2次即可
 */

function cocktailSort (arr) {
    var l = arr.length
    for(let i=0;i<l/2;i++){
        let sorted = true
        // get the biggest one logic
        for(let j=i;j<l-i-1;j++){ // 因为外层循环每执行一轮，就会产生一个最大值和一个最小值，所以 j 的下标从i开始（而非0）
            if(arr[j]>arr[j+1]){
                sorted = false
                let temp = arr[j]
                arr[j]= arr[j+1]
                arr[j+1]= temp
            }
        }
        if(sorted) {
            console.log("外层循环执行次数：",i)
            break
        }
        // get the minimal one logic
        for(let j=l-i-1;j>i;j--){ // 因为外层循环每执行一轮，就会产生一个最大值和一个最小值，所以 j 的终点为i（而非0）
            if(arr[j]< arr[j-1]){
                sorted = false
                let temp = arr[j]
                arr[j]= arr[j-1]
                arr[j-1] = temp
            }
        }
        if(sorted) {
            console.log("外层循环执行次数：",i)
            break
        }
    }
    return arr
}

var  testArr=[3,4,5,6,7,2,8,1]
console.log(cocktailSort(testArr))