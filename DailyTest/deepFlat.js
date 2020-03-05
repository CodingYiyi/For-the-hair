// 实现一个 flattenDeep 函数，把嵌套的数组扁平化

// 1. ES6新增flat函数，https://es6.ruanyifeng.com/?search=flat&x=2&y=4#docs/array#数组实例的-flat，flatMap
function flattenDeep (arr) {
    return arr.flat(Infinity) // flat 函数接受一个参数，指定展开的层数，传递最大值
}

// 2. 利用reduce和concat,递归实现
// 易错点：concat函数不会修改原数组的值，所以14行要重新赋值
// 箭头函数没有中括号包裹{},等价于 return，所以要用 prev.concat(curr)=>return new array ，而不能用 prev.push(curr)=>return length
function flattenDeep (arr) {
    let flattedArray
    flattedArray = arr.reduce((prev, curr) => {
        if (Array.isArray(curr)) prev=prev.concat(flattenDeep(curr))
        else prev.push(curr)
        return prev
    }, [])
    return flattedArray
}
function flattenDeep(arr){
    return arr.reduce((prev,curr)=>Array.isArray(curr)?prev.concat(flattenDeep(curr)):prev.concat(curr),[])
}
console.log(flattenDeep([1, [2,3,[4,5,[6,8,7],[9],10],11]]))

// 3. 使用栈
// eg:[1,[2,[3,4]]]
// stack:[1,[2,[3,4]]] flattedArray:[]
// stack:[1,2,[3,4]] flattedArray:[]
// stack:[1,2,3,4] flattedArray:[]
function flattenDeep(arr){
    var stack = [...arr];
    const flattedArray=[];
    while(stack.length>0){
        let next = stack.pop()
        if(Array.isArray(next)){
            stack.push(...next) // 若取出的元素为数组，则展开后再重新放回栈内，不会改变其顺序
        }else{
            flattedArray.push(next)
        }
    }
    return flattedArray.reverse() // 数组反转
}

