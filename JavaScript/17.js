function fib (n) {
    if (n <= 1) return n
    return fib(n - 1) + fib(n - 2)
}
// console.log(fib(10))

// 尾递归改造
function fib2 (n, val1 = 0, val2 = 1) {
    if (n <= 1) return val2;
    return fib2(n - 1, val2, val1 + val2);
}
console.log(fib2(10000))

// function fib3 (n) {
//     if (n <= 1) return n
//     var val1 = 0, val2 = 1
//     while (n > 1) {
//         [val1, val2] = [val2, val1 + val2]
//         n--
//     }
//     return val2
// }
// console.log(fib3(10))


// var treeNodes = [
//     {
//         id: 1,
//         value: '1',
//         children: [
//             {
//                 id: 11,
//                 value: '11',
//                 children: [
//                     {
//                         id: 111,
//                         value: '111',
//                         children: []
//                     },
//                     {
//                         id: 112,
//                         value: '112'
//                     }
//                 ]
//             },
//             {
//                 id: 12,
//                 value: '12',
//                 children: []
//             }
//         ]
//     },
//     {
//         id: 2,
//         value: '2',
//         children: [
//             {
//                 id: 22,
//                 value: '22',
//                 children: []
//             }
//         ]
//     }
// ];

// function flatten (tree) {
//     let map = new Map(), stack = [], prefix = "", childrenCount = 0
//     for (let i = 0; i < tree.length; i++) {
//         stack.push(tree[i])
//     }
//     while (stack.length) {
//         let node = stack.shift()
//         if(childrenCount){ // 遍历子节点时，
//             childrenCount--
//         }else{ // 子节点遍历完后，向上遍历父节点是，修改prefix的值

//         }
//         map[node.value] = prefix + '-' + node.id
//         if (node.children && node.children.length) {
//             childrenCount = node.children.length
//             stack.unshift(...node.children)
//             prefix += `${node.id}-`
//         }
//     }
// }