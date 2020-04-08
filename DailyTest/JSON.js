// JSON.parse 和 JSON.stringify 各有几个参数，及其作用

/**
 * parse(text: string, reviver?: (this: any, key: string, value: any) => any): any;
 * Converts a JavaScript Object Notation (JSON) string into an object.
 * @param text A valid JSON string.
 * @param reviver A function that transforms the results. This function is called for each member of the object.
 * If a member contains nested objects, the nested objects are transformed before the parent object is.
 * 若属性值为对象，则先转换作为值的对象，再执行属性，类似于树的深度遍历
 * 注意：该方法最后一次会执行key为'',且value为转换后的结果的调用，即会额外调用一次
*/
// var product = '{"id":"0001","type":"donut","name":"Cake","ppu":0.55,"batters":{"batter":[{"id":"1001","type":"Regular"},{"id":"1002","type":"Chocolate"},{"id":"1003","type":"Blueberry"},{"id":"1004","type":"Devil’s Food"}]},"topping":[{"id":"5001","type":"None"},{"id":"5002","type":"Glazed"},{"id":"5005","type":"Sugar"},{"id":"5007","type":"Powdered Sugar"},{"id":"5006","type":"Chocolate with Sprinkles"},{"id":"5003","type":"Chocolate"},{"id":"5004","type":"Maple"}]}'
var productStr = '{"id":"0001","name":"undefined","test":{"childId":"00002"}}'

var productJson = JSON.parse(productStr, (k, v) => {
    if (k === 'id') return v
    if (k === '') return v
    return NaN // 值为 undefined 的属性会被删除掉
})

console.log(productJson)





/**
 * stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 * @param value A JavaScript value, usually an object or array, to be converted.
 * @param replacer A function that transforms the results.
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 */
/**
 * stringify(value: any, replacer?: (number | string)[] | null, space?: string | number): string;
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 * @param value A JavaScript value, usually an object or array, to be converted.
 * @param replacer An array of strings and numbers that acts as a approved list for selecting the object properties that will be stringified.
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 */
var testJson = {
    id: "0001",
    name: "zhang0001",
    child: [
        {
            id: "1001",
            name: "zhang1001",
            child: []
        },
        {
            id: "1002",
            name: "zhang1002",
            child: []
        }
    ]
}

// var testStr = JSON.stringify(testJson, ["id", "name"]) // 第二个参数为数组，类似于删选器，只会输出数组里的属性及其对应值
// var testStr = JSON.stringify(testJson, (k,v)=>{ // 第二个参数为函数，类似于过滤器
//     if(k === "id") return +v
//     return v
// })
var testStr = JSON.stringify(testJson, ["id", "name"], 'haha') // 第三个参数为数字（格式化时空格的个数），或者字符串（代替key前面的默认空格）

console.log(testStr)

// toJSON 的用途
// If the value has a toJSON() method, it's responsible to define what data will be serialized.
// If an object being stringified has a property named toJSON whose value is a function, 
// then the toJSON() method customizes JSON stringification behavior: instead of the object being serialized, 
// the value returned by the toJSON() method when called will be serialized. 
// JSON.stringify() calls toJSON with one parameter:
// 1、if this object is a property value, the property name
// 2、if it is in an array, the index in the array, as a string
// 3、an empty string if JSON.stringify() was directly called on this object

const user = {
    firstName: "Prateek",
    lastName: "Singh",
    age: 26,
    // toJSON: "123" // toJSON 必须是个 函数，否则会被当做普通的对象属性
    toJSON () {
        return {
            fullName: `${this.firstName} ${this.lastName}`
        };
    }
}

console.log(JSON.stringify(user));

