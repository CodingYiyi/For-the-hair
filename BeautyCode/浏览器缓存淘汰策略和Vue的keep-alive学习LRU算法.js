// 原文地址：https://github.com/sisterAn/JavaScript-Algorithms/issues/9

/**
 * LRU （ Least Recently Used ：最近最少使用 ）缓存淘汰策略，故名思义，就是根据数据的历史访问记录来进行淘汰数据，
 * 其核心思想是 如果数据最近被访问过，那么将来被访问的几率也更高 ，优先淘汰最近没有被访问到的数据。
 */


// 前置知识：Map 是有序的，插入顺序就是遍历顺序
/**
Map和Object的区别

1. 一个Object 的键只能是字符串或者 Symbols，但一个Map 的键可以是任意值。
2. Map中的键值是有序的（FIFO 原则），而添加到对象中的键则不是。
3. Map的键值对个数可以从 size 属性获取，而 Object 的键值对个数只能手动计算。
4. Object 都有自己的原型，原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。

set(key, val): 向Map中添加新元素
get(key): 通过键值查找特定的数值并返回
has(key): 判断Map对象中是否有Key所对应的值，有返回true,否则返回false
delete(key): 通过键值从Map中移除对应的数据
clear(): 将这个Map中的所有元素删除

 */
function LRUCache (size) {
    this.size = size
    this.cache = new Map()
}

LRUCache.prototype.put = function (k, v) {
    let { cache } = this
    if (cache.has(k)) { // 若缓存存在，需要更新缓存的位置
        cache.delete(k)
    } else if (cache.size >= this.size) {
        // cache.keys().pop() 错误写法：cache.keys 返回的是一个 MapIterator {key1, key2, key3, key4}，不能直接使用数组的方法
        // Array.from(cache.keys())
        cache.delete(cache.keys().next().value)
    }
    cache.set(k, v)
}

LRUCache.prototype.get = function (k) {
    let { cache } = this
    if (cache.has(k)) { // 若缓存存在，需要更新缓存的位置
        let val = cache.get(k)
        cache.delete(k)
        cache.set(k, val)
    }
    console.log(cache.has(k) ? cache.get(k) : -1)
}


let cache = new LRUCache(2)
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // 返回  1
cache.put(3, 3);    // 该操作会使得密钥 2 作废
cache.get(2);       // 返回 -1 (未找到)
cache.put(4, 4);    // 该操作会使得密钥 1 作废
cache.get(1);       // 返回 -1 (未找到)
cache.get(3);       // 返回  3
cache.get(4);       // 返回  4


/** ES6 class 写法
class LRUCache{
    constructor(max){
        this.max = max;
        this.keys = [];
        this.data = {};
    }

    get __length(){
        return this.keys.length;
    }

    $find(key){
        return this.keys.indexOf(key);
    }

    get(key){
        const findIdx = this.$find(key);
        if(findIdx === -1) return -1;

        this.keys.push(this.keys.splice(findIdx, 1));
        return this.data[key]
    }

    put(key, value){
        const findIdx = this.$find(key);
        if(findIdx === -1){
            if(this.__length === this.max){
                const delKey = this.keys.shift();
                delete this.data[delKey];
                console.log(`该操作会使得密钥 ${delKey} 作废`);
            }
            this.keys.push(key);
            this.data[key] = value;
        }else{ // 更新
            this.keys.push(this.keys.splice(findIdx, 1));
            this.data[key] = value;
        }
    }
}
 */
