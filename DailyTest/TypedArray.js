var before0 = process.memoryUsage()
var arr = new Float32Array(10) // 尝试改为1000000再试试看
var after0 = process.memoryUsage()

console.log("Float32Array:", after0.heapUsed - before0.heapUsed)


var before1 = process.memoryUsage()
var arr = new Array(10) // 尝试改为1000000再试试看
var after1 = process.memoryUsage()

console.log("Array:", after1.heapUsed - before1.heapUsed)


// 什么时候是有常规的Array，什么时候是有TypeArray？
// https://stackoverflow.com/questions/15823021/when-to-use-float32array-instead-of-array-in-javascript
