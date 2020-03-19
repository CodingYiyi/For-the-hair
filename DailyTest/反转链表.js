// 输入一个链表，按链表从尾到头的顺序返回一个 ArrayList
// 首先JS模拟链表：

// var c = { v: "c", next: null }

// var b = { v: "b", next: c }

// var a = { v: "a", next: b }

// a=>b=>c

// 接收一个数组，返回一个上述格式的链表
function chainFactory (arr) {
    let nodeTemp = {
        value:arr.pop(),
        next:null
    }
    let node
    for(let i = arr.length-1;i>=0;i--){
        node = {
            value:arr[i],
            next:nodeTemp
        }
        nodeTemp = node
    } 
    return node
}

var arr = [1, 2, 3, 4]
console.log(chainFactory(arr))

// 链表反转
function reverseChain(chain){
    let nodeArr = []
    while(chain){
        nodeArr.push(chain.value)
        chain = chain.next
    }
    return nodeArr.reverse()
}


console.log(reverseChain(chainFactory([2,3,1,4,5])))