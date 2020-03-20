// 用两个栈来实现一个队列，完成队列的 Push 和 Pop 操作。 队列中的元素为 int 类型。
// 乍一看这个题看似一脸懵逼，what？？？
// JS中拿来的栈结构？再说了，对了不就是先进先出么，push可以用数组的push实现，pop可以用数组的shift实现，这有啥写的？
// 仔细回味下这个问题，是想让你用js中的数组，模拟java中的栈，即不能通过下标操作，也不能通过shift操作（因为正规的栈结构是不支持的），只能使用数组的pop和push

/**
 * 
 入队过程：
 将元素放入 inStack 中。
 
 出队过程：
 outStack 不为空：弹出元素
 outStack 为空：将 inStack 元素依次弹出，放入到 outStack 中（
 时间复杂度是 O(N)，空间复杂度是 O(N)。
 */
function Queue () {
    this.inStack = []
    this.outStack = []
}

Queue.prototype.push = function (val) {
    this.inStack.push(val)
    return this.inStack
}

Queue.prototype.pop = function () {
    if (this.outStack.length === 0) {
        while (this.inStack.length > 0) {
            let item = this.inStack.pop() //在数据转移过程中，顺序已经从后入先出变成了先入先出
            this.outStack.push(item)
        }
    }
    return this.outStack.pop()
}

var queue = new Queue()

queue.push(1)
queue.push(2)
queue.push(3)
console.log(queue.pop())
console.log(queue.pop())
queue.push(4)
queue.push(5)
queue.push(6)
console.log(queue.pop())
console.log(queue.pop())
console.log(queue.pop())
console.log(queue.pop())

// 同理，两个队列模拟一个栈，即只能用js数组的push和shift方法，模拟数组的的push和pop

function Stack(){
    this.inQueue = []
    this.outQueue = []
}

Stack.prototype.push = function(val){
    this.inQueue.push(val)
    return this.inQueue
}

Stack.prototype.pop = function(){
    if(this.inQueue.length>=1){
        while(this.inQueue.length>1){
            let item = this.inQueue.shift()
            this.outQueue.push(item)
        }
        return this.inQueue.shift()
    } else {
        while(this.outQueue.length>1){
            let item = this.outQueue.shift()
            this.inQueue.push(item)
        }
        return this.outQueue[0]
    }
}

var stack = new Stack()

stack.push(1)
stack.push(2)
stack.push(3)
stack.push(4)
console.log(stack.pop())
console.log(stack.pop())
stack.push(5)
console.log(stack.pop())
stack.push(6)
console.log(stack.pop())
console.log(stack.pop())
console.log(stack.pop())