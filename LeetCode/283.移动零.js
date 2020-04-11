/**
 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

 示例:

 输入: [0,1,0,3,12]
 输出: [1,3,12,0,0]
 说明:

 必须在原数组上操作，不能拷贝额外的数组。
 尽量减少操作次数。

 来源：力扣（LeetCode）
 链接：https://leetcode-cn.com/problems/move-zeroes
 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */

// 题解：利用双指针，一个遍历数组，一个存放下一个交换的位置，遇到零就将arr[i]与arr[j]交换
function moveZero(arr){
    var j=0;
    for (let i = 0; i < arr.length; i++) {
        if(arr[i]!==0) [arr[j++],arr[i]] = [arr[i],arr[j]] // 等价于 [arr[j],arr[i]] = [arr[i],arr[j]]; j++;
    }
    console.log(arr)
}

// 优质答案，速度很快62ms
var moveZeroes = function(nums) {       
    for(var i = nums.length;i--;){ // 倒叙遍历数组，i=0时跳出for循环
        if(nums[i]===0){ //遇到0的话，就从把当前位置的0删掉，再在数组末尾出push一个0
            nums.splice(i,1) //这个不是会改变数组的大小么？
            nums.push(0);
        }
    }
};

var testArr = [0,1,0,3,12]
moveZero(testArr)