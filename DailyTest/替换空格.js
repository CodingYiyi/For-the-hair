// 请实现一个函数，将一个字符串中的每个空格替换成“%20”。例如，当字符串为 We Are Happy.则经过替换之后的字符串为 We%20Are%20Happy。


// 第一反应是使用正则表达式
function replaceSpace (str) {
    return str.replace(/ /g, '%20')
}

// 不使用正则，第二反应，使用字符串分割，拼接的方式
function replaceSpace (str) {
    return str.splite(" ").join("%20")
}

// 第三种：遍历字符串，遇到空格则替换
// 误区：str = "abc" str[0] === "a"  str[0]="1" => 不会改变a的值，仍旧是"abc"
// 字符串的subString方法只能截取字符串，不能像数组的splice函数一样既可以截取也可以替换（在截取的位置插入）
function replaceSpace (str) {
    let resArray = []
    for (let i = 0; i < str.length; i++) {
        if (str[i] === " ") {
            resArray.push("%20")
        } else {
            resArray.push(str[i])
        }
    }
    return resArray.join("")
}

// 第四种：双指针
// 一个遍历字符串，一个记录插入位置
// j遍历字符串，i记录插入数组的位置，i++是关键，保证每一次循环后，i都处于正确的位置，供下一次循环使用
function replaceSpace (str) {
    let resArray = []
    for (let i = 0,j=0; j < str.length; j++) {
        if (str[j] === " ") {
            resArray[i++] = "%"
            resArray[i++] = "2"
            resArray[i++] = "0"
        } else {
            resArray[i++] = str[j]
        }
    }
    return resArray.join("")
}

console.log(replaceSpace("a b  c12 4 3 aaa v"))


