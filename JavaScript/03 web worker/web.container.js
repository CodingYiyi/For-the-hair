let http = require('http');
let url = require('url');
let util = require('util');
 
let fs = require('fs'); // 引入fs文件系统模块
 
let server = http.createServer((req,res)=> {
    var pathname = url.parse(req.url).pathname;    // 获取文件名称
    console.log(pathname);
    fs.readFile(pathname.substring(1), function (err,data) {
        if(err) {
            res.writeHead(404,{
                'Content-Type':'text/html'
            });
        } else {
            res.writeHead(200,{
                'Content-Type':'text/html'
            })
            res.write(data.toString());
        }
        res.end();
    });
 
}).listen(8889, 'localhost', () => {
console.log("服务器已经运行,请打开浏览器,输入http://localhost:8889/index.html 来进行访问.")
})