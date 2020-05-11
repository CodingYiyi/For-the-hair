// 观察者模式的核心：被观察者中保存了所有的观察者
// Subject（被观察者）：被观察的对象。当需要被观察的状态发生变化时，需要通知队列中所有观察者对象。Subject需要维持（添加，删除，通知）一个观察者对象的队列列表。
// Observer（观察者）：接口或抽象类。当Subject的状态发生变化时，Observer对象将通过一个callback函数得到通知。
class Subject{
    constructor(name){
        this.name = name
        this.observers = [] // 观察者要放到被观察者中
    }
    attach(observer){
        this.observers.push(observer)
    }
    publish(data){
        this.observers.forEach(o=>o.update(data))
    }

}

class Observe{
    constructor(name){
        this.name = name
    }
    update(data){
        console.log(this.name+" get "+data)
    }
}

var sub = new Subject("lao zhang")
var o1 = new Observe("observe 1")
var o2 = new Observe("observe 2")
sub.attach(o1)
sub.attach(o2)
sub.publish("new data1")
sub.publish("new data2")