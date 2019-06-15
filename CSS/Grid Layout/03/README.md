# 根据网格线进行元素item布局（项目属性）


**grid-column 属性是 grid-column-start 和 grid-column-end 的合并简写形式。**

grid-row 属性是 grid-row-start 和 grid-row-end 的合并简写形式。

grid-column: grid-column-start / grid-column-end;

grid-row: gird-row-start / grid-row-end;

```
// 项目item-1占据第一行，从第一根列线到第三根列线。
.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
/* 等同于 */
.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}
```

**span 关键字表示跨越多少个网格。**

```
/* 等同于 */
.item-1 {
  grid-column: 1 / span 2;
  grid-row: 1 / span 2;
}
```

斜杠以及后面的部分可以省略，默认跨越一个网格。

```
// 项目item-1占据左上角第一个网格。
.item-1 {
  grid-column: 1;
  grid-row: 1;
}
```