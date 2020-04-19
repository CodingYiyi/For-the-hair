let foo = 1

setTimeout(()=>{
  foo=2;
  module.exports={foo};//注意：指向新内存 {foo:2}
},1000)
module.exports={foo}; //指向内存 {foo:1}


