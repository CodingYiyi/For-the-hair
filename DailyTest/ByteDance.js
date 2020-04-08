// https://juejin.im/post/5e6a14b1f265da572978a1d3

/** 1：最大和的连续子数组
 * 给定一个数组，输出具有最大和的连续子数组
 * eg:[1,-2,3,4,-1,5] => [3,4,-1,5]
 * 思路：如何判断连续区间【x,y】内的数据是否在最终的结果中，只要该区间的和（sum）大于0即可
 * 依次遍历数组元素，记录其当前下标下的元素和sum，若sum>0,则说明改区间内的元素和为正激励；
 * 若sum<0，说明该区间内元素和为负激励，不应包含在最终结果集中。
 * 注意：还需要增加一个变量max，记录操作前的sum和操作后的sum中的最大值（即当前item正负的问题）
 */
/**
在古老的一维模式识别中,常常需要计算连续子向量的最大和,当向量全为正数的时候,问题很好解决。但是,如果向量中包含负数,是否应该包含某个负数,并期望旁边的正数会弥补它呢？
例如:{6,-3,-2,7,-15,1,2,2},连续子向量的最大和为8(从第0个开始,到第3个为止)。(子向量的长度至少是1)
遍历array，对于每一个数字，我们判断，（之前的sum + 这个数字） 和 （这个数字） 比大小，如果（这个数字）自己就比 （之前的sum + 这个数字） 大的话，那么说明不需要再继续加了，直接从这个数字，开始继续，因为它自己已经比之前的sum都大了。
反过来，如果 （之前的sum + 这数字）大于 （这个数字）就继续加下去。
动态规划：
只遍历数组一遍，当从头到尾部遍历数组A， 遇到一个数有两种选择 （1）加入之前subArray （2）自己另起一个subArray
设状态F[i], 表示以array[i]结尾的最大连续子序列和，状态转移方程如下:
F[i] = max(F[i-1] + array[i],array[i])
从状态转移方程上F[i]只与F[i-1]有关，与其他都无关，因此可以用一个变量来记住前一个的最大连续数组和就可以了。这样就可以节省空间了。
*/
function biggestSum (arr) {
    // max与resArr保持同步，sum与sumArr保持同步
    var resArr = [], max = 0, sum = 0, sumArr = []
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        // 初始化赋值
        if (resArr.length === 0) {
            resArr = [item]
            sumArr = [item]
            sum = item
            max = item
        } else {
            // 只要sum的值仍为正数，就有可能保留在最终结果集中（注意只是有可能，下文还需要与max对比判断，才能确定是否会出现在结果集中）
            if (sum > 0) {
                sum += item
                sumArr.push(item)
            } else { // 若sum的值为负数，则绝对不可能出现在结果集中，则重置sum及sumArr
                sum = item
                sumArr = [item]
            }
        }
        // 这一步很关键！因为我们只判断了sum的正负，没有判断当前item的正负，所以sum+item之后可能变小，只有确定在sum+item变大之后，才会更新max及resArr的值
        if (max < sum) {
            resArr = [...sumArr]
            max = sum
        }
    }
    console.log(max)
    return resArr
}

// 动态规划转移方程：
// local[i + 1] = Max(local[i] + item, item);
// global[i + 1] = Max(local[i + 1], global[i]);
function biggestSum (arr) {
    var local = arr[0], global = arr[0]
    for (let i = 1; i < arr.length; i++) {
        let item = arr[i]
        local = Math.max(item, local + item)
        global = Math.max(global, local)
    }
    return global
}

// var testArr = [1, -2, 3, 4, -1, 5]
var testArr = [-2, 2, -1, 2, -3]
// var testArr = [-2, -1, -1, -3]
console.log(biggestSum(testArr))

/** 2：最小值和区间和的最大值
给定一个正整数数列a, 对于其每个区间, 我们都可以计算一个X值;
X值的定义如下: 对于任意区间, 其X值等于区间内最小的那个数乘上区间内所有数和;
现在需要你找出数列a的所有区间中, X值最大的那个区间;
如数列a为: 3 1 6 4 5 2; 则X值最大的区间为6, 4, 5, X = 4 * (6+4+5) = 60;
*/
// 思路：双层for循环，时间复杂度为 n+(n-1)+(n-2)+……+1 = n*(a_1+a_n)/2 = n(n+1)/2 故时间复杂度为 O(n^2)
function biggestSection (arr) {
    var min = 0, sum = 0, t = 0, resObj = []
    for (let i = 0; i < arr.length; i++) {
        min = arr[i] //默认第一项为最小值，遍历剩余项，若出现更小的，则更新min的值
        sum = min //区间和累加器
        for (let j = i + 1; j < arr.length; j++) {
            let itemInner = arr[j]
            min = Math.min(min, itemInner) // 更新区间内的最小值
            sum += itemInner //和累加
            if (min * sum > t) { //出现新的最大值时，放入结果集中，可以保证最后一项就是我们想要的区间集
                t = min * sum
                resObj.push([i, j])
            }
        }
    }
    return resObj
}

// 思路：动态规划转移方程 时间复杂度：O(n)
// local[i+1] = MAX(item*item, (sum[i]+item)*MIN(item,min))
// global[i+1] = MAX(global[i],local[i+1])
function biggestSection (arr) {
    var min = arr[0], sum = arr[0],
        local = arr[0] * arr[0],
        global = arr[0] * arr[0]
    for (let i = 1; i < arr.length; i++) {
        let item = arr[i]
        min = Math.min(min, item)
        if (item * item > (sum + item) * min) {
            local = item * item
            min = item
            sum = item
        } else {
            local = (sum + item) * min
            sum += item
        }
        global = Math.max(global, local)
    }
    return global
}

var testArr = [3, 1, 6, 4, 5, 2, 10, 5, 6, 7, 3, 8]
// var testArr = [3, 1, 6, 4, 5, 2]
console.log(biggestSection(testArr))


/** 3：乘积最大值
 * 给定一个数组（有正数、也有负数），输出乘积最大的连续子集
 * eg：[2,3,-2,4] => 2*3 =>6
 * 若都是正整数，则问题很简单，结果就是原数组
 * 但要考虑到一种特殊情况，即负数和负数相乘：如果前面得到一个较小的负数，和后面一个较大的负数相乘，得到的反而是一个较大的数，如{2，-3，-7}，
 * 所以，我们在处理乘法的时候，除了需要维护一个局部最大值，同时还要维护一个局部最小值，由此，可以写出如下的转移方程式：
 * max_copy[i] = max_local[i]
 * max_local[i + 1] = Max(Max(max_local[i] * item, item),  min_local * item)
 * min_local[i + 1] = Min(Min(max_copy[i] * item, item),  min_local * item)
 * global = MAX(global,max_local)
 */

function biggestProduct (arr) {
    var local_min = arr[0], local_max = arr[0], global = arr[0]
    for (let i = 1; i < arr.length; i++) {
        const item = arr[i]
        let local_max_copy = local_max // 备份当前的最大值，因为下文会对当前值进行覆盖，导致值丢失的情况
        local_max = Math.max(local_max*item,item,local_min*item) //当前最大值与新加入的值乘积、新加入的值乘1、最小值与新加入值的乘积，这三个值取最大值
        local_min = Math.min(local_max_copy*item,item,local_min*item)// 保存一份最小值（最小值与负数相乘可能变成一个很大的正数）
        global = Math.max(global,local_max)
    }
    return global
}

var testArr = [3, 0.1, -6, 4, -5, -2]
console.log(biggestProduct(testArr))