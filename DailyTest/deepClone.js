deepCopy(obj: any) {
    let circulateObj = new Map(); //解决循环引用导致栈溢出的问题
    function dpCopy(obj:any){
        if (obj === null) return null;
        if (typeof obj !== 'object') return obj;
        if (obj.constructor === Date) return new Date(obj);
        if (obj.constructor === RegExp) return new RegExp(obj);
        if (typeof obj === "object") {
            if(circulateObj.get(obj)) return circulateObj.get(obj)
            else circulateObj.set(obj,Array.isArray(obj)?[]:{})
        }
        var newObj = new obj.constructor(); // 此行代码为关键，否则会出现输入为数组、输出为对象的情况
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) { // 用obj.hasOwnProperty(key)来判断属性是否来自原型链上，因为for..in..也会遍历其原型链上的可枚举属性
                newObj[key] = (typeof obj[key] === "object" ? dpCopy(obj[key]) : obj[key]);
            }
        }
        return newObj;
    }
    return dpCopy(obj)
}