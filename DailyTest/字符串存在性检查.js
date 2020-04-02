// 请使用最基本的遍历来实现判断字符串 a 是否被包含在字符串 b 中，并返回第一次出现的位置（找不到返回 -1）。

a = '34'; b = '1234567'; // 返回 2
// a = '35'; b = '1234567'; // 返回 -1
// a = '355'; b = '12354355'; // 返回 5
console.log(isContain(a, b));

function isContain (subStr, sourceStr) {
    let res = -1
    for (let i = 0; i < sourceStr.length; i++) {
        if (subStr[0] === sourceStr[i]) {
            res = i
            for (let j = 1; j < subStr.length; j++) {
                if (subStr[j] === sourceStr[i + j]) continue
                else { res = -1; break }
            }
        }
    }
    return res
}