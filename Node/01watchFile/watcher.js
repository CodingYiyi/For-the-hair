// 一个简单的文件监听程序，当监听的文件或文件夹发生改变时，将变化的文件移动至目标文件夹

var fs = require('fs')
var event = require('events')

class watcher extends event.EventEmitter {
    constructor(sourceFolder,targetFolder){
        super()
        this.sourceDir = sourceFolder
        this.targetDir = targetFolder
    }

    watch(){
        fs.readdir(this.sourceDir, (err, files)=>{
            if (err) throw err
            files.forEach(file=>{
                this.emit('process',file)
            })
        })
    }

    start(){
        // fs.watchFile(this.sourceDir,_=>{
        //     this.watch()
        // })
        fs.watch(this.sourceDir,(event,file)=>{
            console.log("event",event)
            console.log("file",file)
            this.watch()
        })
    }
}

module.exports = watcher