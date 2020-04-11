/**《盛最多水的容器》
给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。
在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0)。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
说明：你不能倾斜容器，且 n 的值至少为 2。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/container-with-most-water
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
*/
// 解题思路；双指针
// 面积 = 宽度 * 高度 
// 使用第一列和最后一列, 可以构建宽度最宽的容器, 它的水位是第一根和最后一根中较小的一个的高度。 
// 所有其他容器的宽度会更小, 又因为需要较高的水位才能容纳更多的水, 只能通过提高水位线来获得, 即移动较矮的指针;
// G点：收敛的过程肯定会降低 宽度， 所以只能提升高度，提升高度的办法就是尽量把矮的换成高的

function biggestContainer(arr){
    var leftIndex=0,rightIndex=arr.length-1,max=0
    while(leftIndex<rightIndex){ //收敛的边界
        max=Math.max(Math.min(arr[leftIndex],arr[rightIndex])*(rightIndex-leftIndex),max)
        height[leftIndex]>height[rightIndex] ? rightIndex--:leftIndex++ //收敛的过程
    }
    return max
}
var testArr=[1,8,6,2,5,4,8,3,7]
console.log(biggestContainer(testArr))