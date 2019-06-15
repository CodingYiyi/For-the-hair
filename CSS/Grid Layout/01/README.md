# CSS Grid 布局的 hello world

## 基本概念

学习 Grid 布局之前，需要了解一些基本概念。

**1.容器和项目**

采用网格布局的区域，称为"容器"（container）。

容器内部采用网格定位的子元素，称为"项目"（item）。

```
<div>
  <div><p>1</p></div>
  <div><p>2</p></div>
  <div><p>3</p></div>
</div>
```
上面代码中，最外层的 div 元素就是容器，内层的三个 div 元素就是项目。
> 注意：项目只能是容器的顶层子元素，不包含项目的子元素，比如上面代码的 p 元素就不是项目。
> Grid 布局只对项目生效。

**2.行和列**

容器里面的水平区域称为"行"（row）。

垂直区域称为"列"（column）。

<img src="https://www.wangbase.com/blogimg/asset/201903/1_bg2019032502.png">

上图中，水平的深色区域就是"行"，垂直的深色区域就是"列"。

**3.单元格**

行和列的交叉区域，称为"单元格"（cell）。
正常情况下，n行和m列会产生n x m个单元格。比如，3行3列会产生9个单元格。

**4.网格线**

划分网格的线，称为"网格线"（grid line）。水平网格线划分出行，垂直网格线划分出列。
正常情况下，n行有n + 1根水平网格线，m列有m + 1根垂直网格线，比如三行就有四根水平网格线。

<img src = "https://www.wangbase.com/blogimg/asset/201903/1_bg2019032503.png">

上图是一个 4 x 4 的网格，共有5根水平网格线和5根垂直网格线。

[学习资料](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

[CSS Grid 浏览器兼容性](https://caniuse.com/#feat=css-grid)