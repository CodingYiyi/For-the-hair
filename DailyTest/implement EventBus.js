// 注意：区别【发布-订阅】模式和【观察者】模式

// DOM 的事件机制就是发布订阅模式最常见的实现，这大概是前端最常用的编程模型了，监听某事件，当该事件发生时，监听该事件的监听函数被调用。
class EventEmitter {
    constructor() {
      this._events = Object.create(null);
    }
  
    on(type, handler) {
      (this._events[type] || (this._events[type] = [])).push(handler);
    }
  
    off(type, handler) {
      if (this._events[type]) {
        let index = this._events[type].indexOf(handler);
        index>=0 && this._events[type].splice(index, 1);
      }
    }
  
    once(type, handler) {
      let fired = false;
  
      function magic() {
        this.off(type, magic);
  
        if (!fired) {
          fired = true;
  
          handler.apply(this, arguments);
        }
      }
  
      this.on(type, magic);
    }
  
    emit(type) {
      let payload = [].slice.call(arguments, 1);
  
      let array = this._events[type] || [];
      for (let i = 0; i < array.length; i++) {
        let handler = this._events[type][i];
        handler.apply(this, payload);
      }
    }
  }
  
  export default EventEmitter;