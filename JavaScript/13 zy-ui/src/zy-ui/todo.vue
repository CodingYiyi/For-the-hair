<template>
  <ul>
    <li v-for="item in todoList" v-bind:key="item.id">
        <!-- 作用域插槽：允许父组件访问子组件暴露出去的数据（itemValue），根据数据个性化不同的展示 -->
        <!-- 插槽的代码需要在父组件中编写 -->
      <slot v-bind:itemValue = "item" >
         {{ item.text }} 
      </slot>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'zy-todo',
  props: {
    todos: Array
  },
  data(){
    return {
      todoList:this.todos
    }
  }
}
</script>
