import { count, add } from './a.js'

console.log(count) //0
add();
console.log(count) //1 

// 上述例子证明了esModule输出值的引用，
// 逆向思维：如果输出的是值的拷贝的话，那么add函数执行后，count的值是不会变的。因为index.js中的count是test.js中的count的一个拷贝，
// 又因为count为简单数据类型，所以test.js中的count发生改变后，index.js 中的 count 不会受影响。
// 然而实际结果又是受影响了，所以证明 esm 输出的是值的应用
