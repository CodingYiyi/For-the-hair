
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { //避免还没load就去加载sw.js文件 浪费首屏显示时间
        function registerServiceWorker(){
            return navigator.serviceWorker.register('./sw.js', {
                scope: './'
            }).then(function (registration) {
                console.log("Yes, it did.")
                return registration
            }).catch(function (err) {
                console.log("No it didn't. This happened: ", err)
            })
        }

        function execute() {
            registerServiceWorker().then(registration => {
                registration.showNotification('Hello World!');
            });
        }
        
        // 消息推送模块
        if ('PushManager' in window) {
            let promiseChain = new Promise((resolve, reject) => {
                const permissionPromise = Notification.requestPermission(result => {
                    resolve(result);
                });

                if (permissionPromise) {
                    permissionPromise.then(resolve);
                }
            }).then(result => {
                if (result === 'granted') {
                    execute();
                }
                else {
                    console.log('no permission');
                }
            });
        }
    });
}



function loadImg () {
    document.getElementById("demo").src = "./imgs/timg.jpeg"
}

function requestAjax(){
    var xhr = new XMLHttpRequest()
    xhr.open("GET","./imgs/test.json")
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status==200 || xhr.status == 304){
                console.log("ajax",xhr.response)
            }
        }
    }
    xhr.send()
}

function requestFetch(){
    fetch("./imgs/test.json").then(res=>{
        if(res.status == 200 || res.status == 304) console.log("fetch:",res.response)
    })
}
