// 把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。
// 输入一个递增排序的数组的一个旋转，输出旋转数组的最小元素。
// 例如，数组 [3,4,5,1,2] 为 [1,2,3,4,5] 的一个旋转，该数组的最小值为 1。

// 规律：前期应该是递增，突然递减（临界点一个元素），然后再递增，这个临界点就是数组的最小值，并且数组后半部分的元素的最大值肯定比前半部分的最小值还要小
// 时间复杂度 O(n)
// 暴力穷举：
function getMinItem (arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return arr[i + 1]
    }
    return arr[0]
}

console.log(getMinItem([3, 4, 5, 1, 2]))


// 二分法查找：只要是数组有序，或者部分有序，就一定可以用二分法或者二分法的变种提升查找效率
// 区别在于，二分法查找可能首、尾指针还没碰到一起，就找到了。如果碰到一起还没找到那才能说明没找到
// 但此题必须要首、尾指针碰到一起，才能确定最小值

function getMinItem2 (arr) {
    let startIndex = 0, endIndex = arr.length - 1, middleIndex = parseInt((startIndex + endIndex) / 2)
    while (startIndex !== middleIndex) {
        if (arr[startIndex] > arr[middleIndex]) { // 说明最小值一定在 startIndex 和 endIndex 之间
            endIndex = middleIndex
            middleIndex = parseInt((startIndex + endIndex) / 2)
        } else {
            startIndex = middleIndex
            middleIndex = parseInt((startIndex + endIndex) / 2)
        }
    }
    return Math.min(arr[startIndex], arr[endIndex])
}

console.log(getMinItem2([4, 5, 6, 7, 8, 9, 10, 11, 1, 2, 3]))


// 网上参考答案
var minArray = function (numbers) {
    const length = numbers.length;
    if (!length) {
        return 0;
    }

    let left = 0,
        right = length - 1;
    while (left < right) {
        let mid = Math.floor((left + right) / 2);

        // 子数组有序
        if (numbers[left] < numbers[right]) {
            return numbers[left];
        }

        // 左子数组有序，最小值在右边
        // 那么mid肯定不可能是最小值（因为numbers[mid]大于numbers[left]）
        if (numbers[left] < numbers[mid]) {
            left = mid + 1;
            // 右子数组有序，最小值在左边
            // 这里right=mid因为最小值可能就是numbers[mid]
        } else if (numbers[mid] < numbers[right]) {
            right = mid;
        } else {
            // 无法判断，缩小下范围
            ++left;
        }
    }

    return numbers[left];
};