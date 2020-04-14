
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { //避免还没load就去加载sw.js文件 浪费首屏显示时间
        navigator.serviceWorker.register('./sw.js', {
            scope: './'
        }).then(function (e) {
            console.log("Yes, it did.")
        }).catch(function (err) {
            console.log("No it didn't. This happened: ", err)
        });
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