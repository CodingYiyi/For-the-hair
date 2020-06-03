var fs = require('fs');
var xlsx = require('node-xlsx');

let targetFolder = '/Users/Jackson/Downloads/每一天商品图片/'
let components = []
const files = fs.readdirSync(targetFolder)
files.forEach(function (item, index) {
    let stat = fs.lstatSync(targetFolder + item)
    if (stat.isDirectory() === true) {
        components.push(item)
    }
})

var buffer = [{
    name: '商品条码',
    data: components.map(item=>{
        return [item]
    })
}]

fs.writeFile('res.xlsx', xlsx.build(buffer), function (err) {
    console.log(err)
})