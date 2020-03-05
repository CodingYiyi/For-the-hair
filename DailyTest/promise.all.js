/**
 *  实现promise.all方法
Promise.all(iterable) 方法返回一个 Promise 实例，
此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；
如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 promise 的结果。
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then(function(values) {
  console.log(values);
});  // expected output: Array [3, 42, "foo"]
*/ 

Promise.selfAll = function(promises){
    var resp = []
    for(let i=0;i<promises.length;i++){
        promises[i].then(res=>{
            resp[i]=res
            if(resp.every(item=>!item)){
                return Promise.resolve(res)
            }
        }).catch(e=>{
            return Promise.reject(e)
        })
    }
}

Promise.selfAll2 = function(promises){
    return new Promise((resolve,reject)=>{
        promises=Array.from(promises) //可迭代对象转换为数组
        if(promises.length===0) resolve([])
        else{
            let result = [];
            let counter = 0;
            for(let i=0;i<promises.length;i++){ // 异步原因，i必须用let，或者闭包
                Promise.resolve(promises[i].then(res=>{ // 这里用Promise.resolve包裹的原因？
                    result[i] = res
                    if(++counter === promises.length){ // 当前所有promise对象都执行完毕
                        resolve(result)
                    }
                },err => {
                    reject(err);
                    return; //结束循环？
                }))
            }
        }
    })
}