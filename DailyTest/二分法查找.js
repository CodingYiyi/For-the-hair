// 给定一个数组，和一个待查找的数字target，使用二分法查找的方式返回查找的下标，没找到的话返回-1
// 二分法查找的前提是：数组有序！
function middleSearch (source,target){
    let startIndex=0,endIndex=source.length-1
    while(startIndex <= endIndex){
        let middleIndex = Math.floor((startIndex+endIndex)/2)
        if(source[middleIndex] === target) return middleIndex
        else if(source[middleIndex]<target) startIndex = middleIndex+1
        else endIndex = middleIndex-1
    }
    return -1
}

let source = [2,4,6,8,9,10]
// let source = [2,4,6,8,9,10].sort((a,b)=>b-a)
console.log(middleSearch(source,4))

/**
 
source:[2,4,6,8,9,10]
target:4
 2 4 6 8 9 10
 ↑          ↑ 
 ↑ ↑
   ↑↑
 
source:[2,4,6,8,9,10]
target:7
 2 4 6 8 9 10
 ↑          ↑ 
       ↑    ↑
         ↑↑
        ↑ ↑

*/
