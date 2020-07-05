# WebGL从放弃到真香系列（1）
> ⚠️这是一篇劝退文章，通过一个简单的Demo劝退大家（手动狗头），毕竟好东西都是掌握在少数人手中的（手动狗头*2，想引起各位看官的关注可太难了）

## WebGL概述

> WebGL是一项用来在网页上绘制和渲染复杂三维图形（3D图形），并允许用户与
之进行交互的技术。传统意义上来说，只有高配置的计算机或专用的游戏机才能渲染三
维图形。而现在，随着个人计算机和浏览器的性能越来越强，使用便捷通用的Web 技术
创建渲染三维图形已经成为可能。WebGL技术结合了 HTML5 和 JavaScript，允许开发
者在网页（Web页面）上创建和渲染三维图形。摘自《WebGL编程指南》

## WebGL的起源
PC端两种使用最广泛的三维图形渲染技术：DIrect3D和OpenGL；

Direct3D是微软DirectX技术的一部分，是一套由微软控制的编程接口，主要用在windows平台；

OpenGL开放且免费，所以在多种平台上都有广泛的使用；

WebGL根植于OpenGL，实际上是从OpenGL的一个特殊版本OpenGL ES中派生出来的；

![41592122355_.pic_hd.jpg](https://i.loli.net/2020/06/14/Sbl5HVq7kjicJnh.jpg)

## WebGL程序结构

* 文件类型层面：WebGL没有引入新的文件了性，依旧是传统的HTML和JS文件。

* 编程语言层面：HTML + JS + GLSL ES语法（以字符串的形式输出）。

## WebGL入门
来了，来了，劝退程序来了。通过一个简单地绘制正方形的Demo，对比传统的canvas和WebGL编程方式。
### canvas版本 [api](https://www.w3school.com.cn/tags/html_ref_canvas.asp)

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制正方形（canvas版本)</title>
</head>
<body>
    <canvas id="canvas" width="100" height="100" style="border:1px solid red">
        您的浏览器不支持canvas呢
    </canvas>
</body>
<script>
    function main(){
        // 获取canvas对象
        var canvas = document.getElementById("canvas")
        if(!canvas){
            console.warn("获取canvas对象失败")
            return
        }
        // 获取canvas上下文
        var ctx = canvas.getContext("2d")
        // 绘制蓝色举行
        // fillStyle 和 fillRect 都是canvas上下文提供的方法
        ctx.fillStyle = "rgba(0,0,255,1.0)"
        ctx.fillRect(20,30,30,30)
    }
    document.addEventListener('DOMContentLoaded',function(){
       main()
    });
</script>
</html>
```
![WX20200614-165712@2x.png](https://i.loli.net/2020/06/14/vHFrG2DMQquhbXJ.png)
可以看出通过canvas提供的原生函数绘制一个矩形是很简单的。
### WebGL版本
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制正方形（WebGL版本)</title>
</head>

<body>
    <canvas id="webgl" width="100" height="100" style="border:1px solid red">
        您的浏览器不支持canvas呢
    </canvas>
</body>
<script>
    // 顶点着色器代码（GLSL ES语言）
    // attribute为GLSL ES中的关键词，被称为存储限定符，它表示接下来的变量（此处为a_Position）为attribute变量
    // vec4为GLSL ES（强语言，需要类型修饰符）语言中的一种类型，表示由四个浮点数组成的矢量
    // a_Position为变量名，下文会用到
    // gl_Position为顶点着色器的内置变量，必须被赋值
    var VERTEX_SHADER_SOURCE =
        `attribute vec4 a_Position;
         void main() {
           gl_Position = a_Position;
        }`;

    // 片元着色器代码（GLSL ES语言）
    // gl_FragColor为片元着色器的内置变量，指定片元颜色（RGBA格式）
    var FRAGMENT_SHADER_SOURCE =
        `void main() {
           gl_FragColor = vec4(0.0,0.0,1.0,1.0);
        }`;

    // 获取canvas对象，webgl也是以canvas为载体
    var canvas = document.getElementById("webgl");
    // 参数“webgl”字符串为固定值
    var gl = canvas.getContext('webgl');
    if (!initShaders(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)) {
        alert('Failed to init shaders');
    }
    // 四个顶点的坐标
    var vertices = new Float32Array([ // 左上角开始，逆时针四个顶点
        -0.6, 0.4, // v0
        -0.6, -0.2, // v1
        0.0, 0.4, // v2
        0.0, -0.2 // v3
    ]);
    initVertexBuffers(gl, vertices);
    // 设置 canvas 载体的背景色，此处为白色
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // 清除 canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 绘制正方形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    function initVertexBuffers(gl, vertices) {
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        // 获取attribute变量的存储位置
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
    }

    // 初始化着色器
    function initShaders(gl, vertexShaderSource, fragmentShaderSource) {
        var program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
        if (!program) {
            console.log('Failed to create program');
            return false;
        }
        // 使用生成的着色器渲染canvas
        gl.useProgram(program);
        gl.program = program;
        return true;
    }

    // 加载着色器
    function loadShader(gl, type, source) {
        // create shader object
        var shader = gl.createShader(type);
        if (shader == null) {
            console.log('unable to create shader');
            return null;
        }
        // set shader source code
        gl.shaderSource(shader, source);
        // compile the shader
        gl.compileShader(shader);
        // check compile status
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            var error = gl.getShaderInfoLog(shader);
            console.log('Failed to compile shader: ' + error);
            return null;
        }
        return shader;
    }

    // 生成一个着色器应用
    function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) {
            return null;
        }
        // create a program object
        var program = gl.createProgram();
        if (!program) {
            console.log('gl.createProgram failed');
            return null;
        }
        // attach  the shader objects
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        // link the program object
        gl.linkProgram(program);
        // check link status
        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            var error = gl.getProgramInfoLog(program);
            console.log('Failed to link program: ' + error);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            return null;
        }
        return program;
    }
</script>

</html>
```
![webgl.png](https://i.loli.net/2020/06/14/3skP7hUt4fFIgu5.png)

## 总结
原生canvas和WebGL的几个简单区别：

1. 坐标系，原生canvas绘制图形的时候，坐标系原点在左上角(0,0)，长度以px为单位；WebGL原点在canvas载体的中心点，长度为0.0~1.0的浮点数（可以理解为比例）
2. canvas提供的绘图api可以快速绘制目标图形；WebGL写法繁琐，所有的事情都要亲力亲为。

![vs.png](https://i.loli.net/2020/06/14/6T2rdsM1RBD3LmY.png)


