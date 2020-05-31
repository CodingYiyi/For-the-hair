(function (window) {
     const PENDING = 'pending'
     const RESOLVED = 'resolved'
     const REJECTED = 'rejected'
   
     class Promise {
       constructor(excutor) {
         const self = this
         this.status = PENDING
         this.data = undefined
         this.callbacks = []
         function resolve(value) {
           if (self.status !== PENDING) {
             return
           }
           self.status = RESOLVED
           self.data = value
           if (self.callbacks.length > 0) {
             setTimeout(() => {
               self.callbacks.forEach(callbacksObj => {
                 callbacksObj.onResolved(value)
               })
             });
           }
         }
         function reject(reason) {
           if (self.status !== PENDING) {
             return
           }
           self.status = REJECTED
           self.data = reason
           if (self.callbacks.length > 0) {
             setTimeout(() => {
               self.callbacks.forEach(callbacksObj => {
                 callbacksObj.onRejected(reason)
               })
             });
           }
         }
         excutor(resolve, reject)
       }
   
   
       then(onResolved, onRejected) {
         const self = this
         onResolved = typeof onResolved === 'function' ? onResolved : value => value
         onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
         return new Promise((resolve, reject) => {
           /**
            * 调用指定回调函数处理
            */
           function handle(callback) {
             /**
              * 1.如果返回的不是promise对象，那么就成功，value为返回的值
              * 2.如果返回的是Promise对象, 那么就是该promise对象的结果
              * 3.如果抛出异常, 则失败了，reason为error
              */
             try {
               const result = callback(self.data)
               if (result instanceof Promise) {
                 // 2.如果返回的是Promise对象, 那么就是该promise对象的结果
                 result.then(
                   value => resolve(value),
                   reason => reject(reason)
                 )
                 // result.then(resolve, reject)
               } else {
                 // 1.如果返回的不是promise对象，那么就成功，value为返回的值
                 resolve(self.data)
               }
             } catch (error) {
               reject(error)
             }
           }
           // 当前是pending状态, 保存回调函数
           if (self.status === PENDING) {
             self.callbacks.push({
               onResolved() {
                 handle(onResolved)
               },
               onRejected() {
                 handle(onRejected)
               }
             })
           } else if (self.status === RESOLVED) { // 如果当前是resolved状态, 异步执行onResolved并改变return的promise状态
             setTimeout(() => {
               handle(onResolved)
             });
           } else { // rejected
             setTimeout(() => {
               handle(onRejected)
             });
           }
         })
       }
   
       catch(onRejected) {
         return this.then(undefined, onRejected)
       }
   
       static resolve = function (value) {
         return new Promise((resolve, reject) => {
           // value是promise
           if (value instanceof Promise) {
             value.then(resolve, reject)
           } else { // value不是promise
             resolve(value)
           }
         })
       }
   
       static reject = function (reason) {
         return new Promise((resolve, reject) => {
           reject(reason)
         })
       }
   
       static all = function (promises) {
         const values = new Array(promises.length)
         let resolvedCount = 0
         return new Promise((resolve, reject) => {
           promises.forEach((p, index) => {
             Promise.resolve(p).then(
               value => {
                 resolvedCount++
                 values[index] = value
                 if (resolvedCount === promises.length) {
                   resolve(values)
                 }
               },
               reason => {
                 reject(reason)
               }
             )
           })
         })
       }
   
       static race = function (promises) {
         return new Promise((resolve, reject) => {
           promises.forEach((p, index) => {
             Promise.resolve(p).then(resolve, reject)
           })
         })
       }
   
       static resolveDelay = function (value, time) {
         return new Promise((resolve, reject) => {
           setTimeout(() => {
             // value是promise
             if (value instanceof Promise) {
               value.then(resolve, reject)
             } else { // value不是promise
               resolve(value)
             }
           }, time)
         })
       }
   
       static rejectDelay = function (reason, time) {
         return new Promise((resolve, reject) => {
           setTimeout(() => {
             reject(reason)
           }, time)
         })
       }
   
     }
   
     window.Promise = Promise
   })(window)


   TextDecoderStream