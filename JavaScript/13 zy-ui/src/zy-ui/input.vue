<template>
  <div>
      <span>{{title}}</span>
      <input type="text" :value="value" @change="onInputChange($event)">
      <slot></slot>
  </div>
</template>

<script>
export default {
    name:"zy-input",
    // v-model默认使用的是输入框的 value 和 input 事件实现双向数据绑定的
    // 若要修改默认的绑定事件或者属性，比如value换成checked（input type='checkbox'时候），input换成‘change’时，需要使用model属性
    model:{
        prop:"value",
        event:"  ",
    },
    props:{
        title:String,
        value:String,
    },
    methods:{
        onInputChange(e){
            this.$emit("change",e.target.value)
        }
    }
}
</script>

<style>

</style>