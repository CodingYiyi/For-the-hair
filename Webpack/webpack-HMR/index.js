import hello from './hello.js'
import hello2 from './hello-2.js'
import hello3 from './hello-3.js'
const div = document.createElement('div')
div.innerHTML = hello()
if(module.hot) {
    console.log(module.hot)
    module.hot.accept('./hello.js', function() {
        console.warn('hello.js change!!!')
        div.innerHTML = hello()
    })
    module.hot.accept('./hello-2.js',function(){
        console.warn('hello 2')
        div.innerHTML = hello2 + hello3
    })
    module.hot.accept('./hello-3.js',function(){
        console.warn('hello 3')
        div.innerHTML = hello3
    })
}
document.body.appendChild(div)
