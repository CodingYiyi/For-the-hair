# justify-self 和 align-self

justify-self属性设置单元格内容的水平位置（左中右），跟justify-items属性的用法完全一致，但只作用于单个项目。

align-self属性设置单元格内容的垂直位置（上中下），跟align-items属性的用法完全一致，也是只作用于单个项目。

```
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}
```

start：对齐单元格的起始边缘。

end：对齐单元格的结束边缘。

center：单元格内部居中。

stretch：拉伸，占满单元格的整个宽度（默认值）。
