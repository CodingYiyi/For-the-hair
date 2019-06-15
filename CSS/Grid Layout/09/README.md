# justify-content 和 align-content

justify-content属性是整个内容区域在容器里面的水平位置（左中右）；

align-content属性是整个内容区域的垂直位置（上中下）。

```
.container {
  justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;  
}
```

start：对齐容器的起始边框。

end：对齐容器的结束边框。

center：容器内部居中。

stretch：项目大小没有指定时，拉伸占据整个网格容器(默认值)。

space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍。

space-between：项目与项目的间隔相等，项目与容器边框之间没有间隔。

space-evenly：项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。
