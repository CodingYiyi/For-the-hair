import foo from './a.js';
export default function bar() {  
  if (Math.random() > 0.5) { // 循环依赖必须要有个出口，否则就真的栈溢出了
    foo();
  }
}