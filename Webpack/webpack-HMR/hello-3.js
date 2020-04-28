import hello2 from './hello-2.js'

const hello_3_val = ("hello-333，" + hello2)

if(module.hot){
    module.hot.accept('./hello-2.js',function(){
        console.warn("from hello-3.js", 333)
    })
}

export default hello_3_val