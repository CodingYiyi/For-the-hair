importScripts('./test.js');
console.log(self)
self.onmessage = function (e) {
  console.log('Worker: Message received from main script');
  let result = e.data[0] * e.data[1];
  if (isNaN(result)) {
    postMessage('Please write two numbers');
  } else {
    let workerResult = 'Result: ' + result;
    console.log('Worker: Posting message back to main script');
    postMessage(workerResult);
  }
}

self.onerror = function(e){
  console.log("worker 内部监听error！！！")
  self.close(); // 在 Worker 内部关闭自身
}