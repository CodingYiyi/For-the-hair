// 原文地址：https://github.com/sisterAn/JavaScript-Algorithms/issues/9

/**
 * LRU （ Least Recently Used ：最近最少使用 ）缓存淘汰策略，故名思义，就是根据数据的历史访问记录来进行淘汰数据，
 * 其核心思想是 如果数据最近被访问过，那么将来被访问的几率也更高 ，优先淘汰最近没有被访问到的数据。
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
