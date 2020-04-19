const foo = {
	count: 0
}
exports.foo=foo; //此时foo指向 {count: 0}的内存地址
setTimeout(()=>{
    //改变 foo 的内存指向
	exports.foo='haha';
},1000)
