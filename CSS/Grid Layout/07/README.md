# 神奇的 grid-auto-flow 属性

划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行。

这个顺序其实是由grid-auto-flow属性决定，默认值是row，即"先行后列"。也可以将它设成column，变成"先列后行"。

grid-auto-flow属性除了设置成row和column，还可以设成row dense和column dense，即尽可能紧密填满，尽量不出现空格。
