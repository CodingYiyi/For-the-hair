# WebGL从放弃到真香系列（2）
> 开篇词：这是本系列的第二篇文章，上一篇文章我们通过一个简单的在画布上绘制一个正方形的两种实现方式（canvas VS WebGL）对比了原生canvas和WebGL在绘制图像方面的不同，总结来说就是canvas比较简单，提供了现成的绘图api，开发者只要调用即可（you  want a square? take one）；WebGL相对复杂一些，没有现成的绘制api，只提供了基础api，任何事情都需要你亲力亲为（you want a square? draw one）WebGL由于其晦涩的GLSL 语法使很多人望而却步，因此也劝退了一波人。（内心OS：阿喂，这样下去没人了啊）那有没有可能使这件繁琐的事情简单些呢？必须的么，本文介绍基于WebGL的2D渲染引擎PIXI，先稳定一波军心。

## PIXI介绍&&安装&&运行
[摘抄没意思，自己看文档吧，半个小时就可以读完，中文的！](https://www.bookstack.cn/read/LearningPixi/introduction)

需要注意的一点是，PIXI的运行依赖于web服务器（localhost:3000/@#$%^&/index.html），简单的文件打开的形式是无法正确运行的(file://#$%^&*/index.html)，所以运行的时候开启个web server吧。

## 绘制一个正方形
PIXI提供了低级的绘制图形API，注意低级这个词，没错，你想绘制一个正方形这件事本来就挺低级的（狗头.jpg）。你可以使用它们来创造矩形、线段、复杂的多边形以及文本。并且它使用和Canvas Drawing API几乎一致的api，所以如果你熟悉canvas的话，那么几乎没有什么新东西需要学习。当然另一个巨大的优势在于，不同于Canvas的绘画api，你使用Pixi绘制的图形是通过WebGL在GPU上渲染的。Pixi能够让你获得所有未触碰到的性能。

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制正方形（PIXI版本）</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js"></script>
</head>

<body>
    <canvas id="pixi" style="border:1px solid red">
        您的浏览器不支持canvas呢
    </canvas>
    <script>
        // 解构获取Application和Graphics对象
        let {
            Application,
            Graphics
        } = PIXI
        // 创建app实例（app实例一个stage属性，通常称之为舞台）
        let app = new Application({
            view: document.getElementById("pixi"), // canvas容器
            height:100, // 需要在此声明容器的高宽，直接在canvas标签中写是无效的
            width:100,
            transparent:true, // 背景色透明
            // backgroundColor: 0xffffff // 也可以通过这种形式声明画布的背景色
        })
        // 创建一个图形类实例
        let rectangle = new Graphics();
        // 声明实例的填充色两个参数：（颜色-16进制，透明度-number）
        rectangle.beginFill(0x0000ff,1.0);
        // 指定绘制图形，drawRect函数绘制一个矩形（x,y,width,height），小声bibi：啧啧啧，低级API
        rectangle.drawRect(20, 30, 30, 30);
        // 结束绘制
        rectangle.endFill();
        // 将实例添加到舞台中（这一步很常见，只有添加到stage中的元素才会被显示）
        app.stage.addChild(rectangle);
    </script>
</body>

</html>
```
![pixi.png](https://i.loli.net/2020/06/20/QInYzgTif1OeZdK.png)

**上述这个简单的Demo甚至都不需要开头提到的web server也可以运行**
## 就这？就这？？？

用PIXI绘制简单图形的确有点杀鸡用牛刀的感觉，再写点复杂的？

一个简易版本的赛猫游戏，点击屏幕猫开始移动，点击速度越快移动速度越快

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>赛猫</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js"></script>
</head>

<body onclick="speedup()">
    <script>
        // 初始默认速度
        const DEFAULT_SPEED = 0
        // 解构
        let {
            Application,
            Container,
            loader,
            loader: {
                resources
            },
            utils: {
                TextureCache
            },
            Sprite,
            Rectangle
        } = PIXI
        //初始化pixi应用
        let app = new Application({
            width: 1000,
            height: 256,
            antialias: true,
            transparent: false,
            resolution: 1
        });
        // 将上述app实例生成的canvas节点添加到dom中
        document.body.appendChild(app.view);
        // Pixi强大的loader对象可以加载任何你需要种类的图像资源。加载一个图像并在加载完成时用一个叫做setup的方法来使用它。
        loader
            .add("imgs/cat.png")
            .load(setup);
        let cat;
        // 创建一个精灵来连接loader的resources对象
        function setup() {
            cat = new Sprite(resources["imgs/cat.png"].texture); // 创建精灵
            cat.y = 96; // 设置纵坐标
            cat.vx = DEFAULT_SPEED; // 设置x轴初始速度
            app.stage.addChild(cat); // 将cat精灵添加到舞台stage中
            app.ticker.add(delta => gameLoop(delta)); // 使用Pixi的ticker，任何在ticker里的代码都会1秒更新60次，跟requestAnimationFrame有点像
        }
        // 移动
        function gameLoop(delta) {
            // 设定安全边界
            if (cat.x < app.screen.width - cat.width) {
                cat.x += cat.vx;
                slowdown()
            }
        }
        // 加速
        function slowdown() {
            if (cat && cat.vx > 0) {
                cat.vx = (cat.vx * 10 - 1) / 10
            }
        }
        // 减速
        function speedup() {
            if (cat) cat.vx += 2
        }
    </script>
</body>

</html>
```
![move-cat.gif](https://i.loli.net/2020/06/20/LdaszFxZ1VJI8W3.gif)

导出的git看起来有点卡顿，实际是很流畅的（即使gameLoop函数每秒执行60次），感兴趣的同学可以将上述代码扒下来自己实操一下（自备一张🐱张图）。

你说什么？控制台报错？

```
#$%^&*.html:1 Access to image at 'file:///@#$%^&/cat.png' from origin 'null' has 

been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: 

http, data, chrome, chrome-extension, https.
```
**你是不是没仔细读我上面写的东西？**

## 知识点

### 将大象装进冰箱需要几步？错了重来：怎样利用PIXI渲染图片？
因为Pixi用WebGL和GPU去渲染图像，所以图像需要转化成GPU可以处理的版本，可以被GPU处理的图像被称作**纹理**。
 
### 那么问题来了：怎样加载图像并将其转化成纹理并显示到页面中？
1. 通过PIXI提供的loader对象添加目标图像（添加完成后便可以获取到对应图片的纹理texture）
2. 在load函数中创建精灵（利用上述图片的纹理创建精灵sprite）
3. 将精灵添加到stage中（不添加是不会显示的）

```
PIXI.loader
  .add("images/anyImage.png") // step 1
  .load(setup);
function setup() {
  let sprite = new PIXI.Sprite(  // step 2
    PIXI.loader.resources["images/anyImage.png"].texture
  );
  app.stage.addChild(sprite);  // step 3 这样图片就显示出来了
}
```

 