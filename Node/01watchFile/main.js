const fs = require('fs')
const Watcher = require('./watcher')

const sourceDir = './sourceFolder'
const targetDir = './targetFolder'

const watcher = new Watcher(sourceDir, targetDir)

watcher.on('process',(file)=>{
    const sourceFile = `${sourceDir}/${file}`
    const targetFile = `${targetDir}/${file}`
    // fs.rename :异步地把 oldPath 文件重命名为 newPath 提供的路径名。 如果 newPath 已存在，则覆盖它
    // 此处用于通过修改文件路径的方式移动文件
    fs.rename(sourceFile,targetFile,err=>{
        if (err) throw err
    })
})

watcher.start()


