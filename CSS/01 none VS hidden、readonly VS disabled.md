#display:none和visibility:hidden的区别
#表单中Readonly和Disabled的区别

##display:none和visibility:hidden的区别
>使用css让元素不可见的方法有很多种，裁剪、定位到屏幕外边、透明度变换等都是可以的。但是最常用两种方式就是设置元素样式为display: none或者visibility: hidden。

### display:none
如果给一个元素设置了display: none，那么**该元素以及它的所有后代元素都会隐藏**，隐藏后的元素无法点击，无法使用屏幕阅读器等辅助设备访问，**占据的空间消失**。

### visibility:hidden
给元素设置visibility: hidden也可以隐藏这个元素，但是**隐藏元素仍需占用与未隐藏时一样的空间**，也就是说虽然元素不可见了，但是仍然会影响页面布局。

### display: none与visibility: hidden的区别
1、display:none是彻底消失，不在文档流中占位，浏览器也不会解析该元素；visibility:hidden是视觉上消失了，可以理解为透明度为0的效果，在文档流中占位，浏览器会解析该元素；
使用visibility:hidden比display:none性能上要好，display:none切换显示时，页面产生回流（当页面中的一部分元素需要改变规模尺寸、布局、显示隐藏等，页面重新构建，此时就是回流。所有页面第一次加载时需要产生一次回流），而visibility切换是否显示时则不会引起回流。

2、visibility具有继承性，给父元素设置visibility:hidden，子元素也会继承这个属性。但是如果重新给子元素设置visibility: visible，则子元素又会显示出来。这个和display: none有着质的区别。

3、visibility: hidden不会影响计数器的计数，如图所示，visibility: hidden虽然让一个元素不见了，但是其计数器仍在运行。这和display: none完全不一样

```
 <body>
        <div>
            <strong>给元素设置visibility:hidden样式</strong>
            <ol>
                <li>元素1</li>
                <li style="visibility:hidden;">元素2</li>
                <li>元素3</li>
                <li>元素4</li>
            </ol>
        </div>
        <div>
            <strong>给元素设置display:none样式</strong>
            <ol>
                <li>元素1</li>
                <li style="display:none;">元素2</li>
                <li>元素3</li>
                <li>元素4</li>
            </ol>
        </div>
    </body>
```
![](https://img-blog.csdn.net/20180624222342801)

##  CSS属性disabled和readonly的区别
1、作用范围不同；
disabled属性可以用于所有的表单元素。
readonly属性只对`<input type='text'>、<textarea>和<input type='password'>`有效。

2、对元素的影响程度不同；
disabled属性阻止对元素的一切操作，例如获取焦点，点击事件等等。
readonly属性只是将元素设置为只读，其他操作正常。

3、表单提交
disabled属性会使文本框变灰，而且通过表单提交时，获取不到文本框中的value值（如果有的话）。
readonly属性只是使文本框不能输入，外观没有变化，而且表单提交时可以获取value值。