# v-for 中的 key

一直不理解v-for中Key的作用，都说不要用数组的下标作为key，可是印象里平时开发也是用数组的index作为key，也没遇到什么Bug。阅读了几篇文章，都没办法完全睡服我（斜眼笑）。遂深入看了下 Vue 的源码（patch.js），不得不说，源码是个好东西，看完茅塞顿开，希望我能写出一份能睡服各位的解释文档。

## 为什么需要key
> 一句话，vue为了复用节点，Dom操作（插入删除移动等）是很消耗性能的，采用了一系列规则（自己看源码）尽可能去复用节点，减少Dom操作，从而提升性能。

但是你性能的提升也得建立在代码正常的情况下吧，要是渲染都跟预期不一致了，还谈何性能？？？
不指定Key的情况下，的确有一些情况会导致异常，常见的就是如下图（没有指定key），渲染一个数组【a,b,c】,点击按钮，删除第一项。

<img src="./img/11-02.png" width="45%"/>
<img src="./img/11-03.png" width="45%"/>

很神奇吧，a的确被删掉了，但是其选中的状态被保存下来了。这就是我上文提到的程序异常。

也就是说，a节点被莫名其妙地复用了，vue单纯地把a标签的内容改变成b而已（其实删掉的是最后一个节点），为啥呢？让我们看下源码中，vue是怎么判断一个节点要不要被复用的:

```
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```
上述代码其实很通俗易懂了，判断节点是否相同（决定是否要复用）的几个关键点：相同的key，相同的html标签，如果是input标签的话，再判断下是否是相同的type。

回到上述列子，初次渲染的结果三个dom节点：【a】，【b】，【c】都是li标签，没有key（即undefined）

删掉第一项：js通过数组操作删掉了第一项，此时数组变成【b，c】，由于数组的shift操作会触发vue的重新渲染，则会产生2个新的节点：【b】，【c】（此处说的节点是vNode，不是真实的dom节点）

vue开始diff（updateChildren函数），那新的【b】和初次渲染的【a】对比，key是否相同？是的（都是undefined）；是否是相同的标签？是的，都是li标签。那妥了，节点复用。

所以现象就是数据的确是最新的，但是节点的一些状态（若有子组件也同理）会被保存，可以试下这个小例子：

[别人写的一个小demo，我白嫖了](https://codesandbox.io/s/vue-template-z5xud?fontsize=14)


## 我需要个什么样的key？

> 一句话，跟每个被循环的item强绑定且无重复的key

那数组的下标 index 可以吗？不可以！让我告诉你为啥：还是上述🌰

初次渲染的结果三个dom节点：【a】，【b】，【c】都是li标签，key分别是0，1，2

删掉第一项：js通过数组操作删掉了第一项，此时数组变成【b，c】，由于数组的shift操作会触发vue的重新渲染，则会产生2个新的节点：【b】，【c】（此处说的节点是vNode，不是真实的dom节点）

vue开始diff（updateChildren函数），那新的【b】和初次渲染的【a】对比，key是否相同？是的（都是0，下标都是从0开始的啊喂，这能理解吧）；是否是相同的标签？是的，都是li标签。那妥了，节点复用。

所以结果还是节点会被复用。

那我改造下：key做成特殊字符串+index的形式，可以吧？（珠峰vue公开课提到的办法，当时老师其实讲错了，老师的结论是可以），不行！同理么，你品下，你细品下。比如都统一加一个字符串abc，那初次渲染的第一项key为“abc-0”，删除后第一项的key不仍旧是“abc-0”么，依旧会被复用。

所以你需要一个跟item强绑定且无重复的key，例如下述数据结构：

```
[
	{text:"a",id:0,checked:false},
	{text:"b",id:1,checked:false},
	{text:"c",id:2,checked:false},
]
```
此时指定key为item.id，这样就可以了，可能你会问，这不依旧是0，1，2的顺序吗，有区别么？

```
<ul>
    <li v-for="(item,index) in list" :key='item.id'>
        <input type="checkbox" :value="item.checked">
        <span>{{item.text}}</span>
    </li>
</ul>
```
首次渲染的确没区别，但是删除第一项后，数组变成了:

```
[
	{text:"b",id:1,checked:false},
	{text:"c",id:2,checked:false},
]

```
此时构建的vNode为：【b】（key为1），【c】（key为2），判断节点复用的时候，第一项的key（原来是0，现在是1）发生了变化，所以不会复用了。

## 为什么平时开发使用index作为key也没发现什么异常呢？

业务场景不同！

仔细回顾下，没有异常的情况是不都只是单纯地渲染列表，比如消息列表，商品列表等，而没有动态操作列表的情况？又或者有动态操作列表的情况，但是列表只是单纯地展示数据，并没有其他的附属状态（比如上例的选中状态）
这两种情况下，节点被复用也是无可厚非的，并且vue官方文档也有说，如果业务场景允许，推荐节点复用，以提升性能。


