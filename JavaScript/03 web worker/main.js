const first = document.querySelector('#number_1');
const second = document.querySelector('#number_2');

const result = document.querySelector('#result');

if (window.Worker) {
	const myWorker = new Worker("worker.js");

	first.onchange = function() {
	  myWorker.postMessage([first.value, second.value]);//主进程向worker发送消息
	  console.log('Message posted to worker');
	}

	second.onchange = function() {
	  myWorker.postMessage([first.value, second.value]);
	  console.log('Message posted to worker');
	}

	// 主进程接受worker消息
	myWorker.onmessage = function(e) {
		result.textContent = e.data;
		console.log('Message received from worker');
	}
	// 主进程监听worker错误
	myWorker.onerror = function(e){
		console.log("worker error!!!",e)
	}
	
	// 时隔10秒后主进程关闭worker
	setTimeout(function(){
		myWorker.terminate(); 
	},10000)
} else {
	console.log('Your browser doesn\'t support web workers.')
}