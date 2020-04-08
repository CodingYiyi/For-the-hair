// apply 方式存在的问题是function的name属性会被重写……
Function.prototype.clone = function(){
    var that = this;
    var temp = function tempFunc(){return that.apply(this,arguments)}
    for(var key in this) { // 拷贝原型链上的属性
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp
}

var x = function() {
    return 1;
};

x.prototype.test = function(){
    console.log("x.test")
}

console.log(x === x.clone());
console.log(x() === x.clone()());
console.log(x)