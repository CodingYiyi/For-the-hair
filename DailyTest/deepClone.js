// https://mp.weixin.qq.com/s?__biz=MzI3NjM1OTI3Mw==&mid=2247483692&idx=1&sn=ab072f6e9bf145cda31b19b96131faf7&chksm=eb77f02adc00793c60966183ae6ef692d3f5c8518ea04fe5491e2de70183e8637ec7dd843ab2&scene=21#wechat_redirect
function deepCopy (obj) {
    let circulateObj = new Map(); //解决循环引用导致栈溢出的问题
    function dpCopy (obj) {
        if (obj === null) return null;
        if (typeof obj !== 'object') return obj;
        if (obj.constructor === Date) return new Date(obj);
        if (obj.constructor === RegExp) return new RegExp(obj);
        if (typeof obj === "object") {
            if (circulateObj.get(obj)) return circulateObj.get(obj)
            else circulateObj.set(obj, obj)
        }
        var newObj = new obj.constructor; // 此行代码为关键，否则会出现输入为数组、输出为对象的情况，主要是在执行 newObj[key]的时候
        // for in 的方法会遍历原型链，影响性能，故采用 Object.keys() 的方式
        // for (let key in obj) {
        //     if (obj.hasOwnProperty(key)) { // 用obj.hasOwnProperty(key)来判断属性是否来自原型链上，因为for..in..也会遍历其原型链上的可枚举属性
        //         newObj[key] = (typeof obj[key] === "object" ? dpCopy(obj[key]) : obj[key]);
        //     }
        // }
        for (let key of Object.keys(obj)) {
            newObj[key] = (typeof obj[key] === "object" ? dpCopy(obj[key]) : obj[key]); // TODO：这一步没有处理 typeof 为 ‘function’ 的情况，好像lodash也没有处理
        }
        return newObj;
    }
    return dpCopy(obj)
}

function person (name) {
    this.pname = name
}

const Messi = new person('Messi');

function say () {
    console.log('hi');
}


var data = {

    speak: say,
    son:Messi
}

data.circulateData = data
var res = deepCopy(data)
console.log(res)


