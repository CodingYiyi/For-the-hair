/*
给定一个无序的整数数组，找到其中最长上升子序列的长度。
示例：
输入: [10,9,2,5,3,7,101,18]
输出: 4
解释: 最长的上升子序列是 [2,3,7,101]，它的长度是 4。
*/

// 注意区分最长子序列和最长连续子数组的区别，最长子序列不要求一定是连续的。
// 存储上升子序列的结果：
var lengthOfLIS = function(nums=[]) {
    if(nums.length<1) return 0
    let resMap = new Map()
    let maxLength = 1
    for(let i=0;i<nums.length;i++){
        let max_i = 0
        for(let j=0;j<i;j++){
            let max_j = resMap.get(j)
            if(nums[i]>nums[j] && max_j.length+1>max_i){
                resMap.set(i,[...max_j,nums[i]])
                max_i = max_j.length+1
            }
        }
        if(!resMap.get(i)) resMap.set(i,[nums[i]])
        maxLength = Math.max(resMap.get(i).length,maxLength)
    }
    console.log(resMap)
    return maxLength
};

// 作者：Alexer-660
// 链接：https://leetcode-cn.com/problems/longest-increasing-subsequence/solution/300-zui-chang-shang-sheng-zi-xu-lie-by-alexer-660/
// 来源：力扣（LeetCode）
var lengthOfLIS = function(nums) {
    let n = nums.length;
    if(n == 0){
        return 0;
    }
    let dp = new Array(n).fill(1);
    let max = 0;
    for(let i = 0;i < n;i++){
        for(let j = 0;j < i;j++){
            if(nums[j] < nums[i]){
                dp[i] = Math.max(dp[i],dp[j]+1);
            }
        }
        max = Math.max(max,dp[i]);
    }
    return max;
};


// var testArr = [10,9,2,5,3,7,101,18,19]
var testArr = [10,22,9,33,21,50,41,60,80]

lengthOfLIS(testArr)

