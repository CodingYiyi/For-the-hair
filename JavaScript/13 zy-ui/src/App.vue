<template>
  <div id="app">
    <zy-button @click.native="nativeClick($event)"
               @selfClick="click($event)"
               round>常规按钮</zy-button>
    <zy-button type="danger"
               icon="test">危险那妞</zy-button>
    <zy-button type="info">消息按钮</zy-button>
    <zy-icon></zy-icon>
    <bu-button></bu-button>
    <input type="text"
           v-model="question">
    <p>{{answer}}</p>
    <p>静态数据：{{dataNotInData}}</p>
    <zy-input v-model="inputVal"
              title="自定义输入框："><span>这里显示插槽内容</span></zy-input>
    <p>{{inputVal}}</p>
    <zy-todo :todos="todos">
      <!-- itemValue 为子组件暴露出来的属性名称，此处使用es6的解构写法 -->
      <!-- 等价于以下写法：slotProps 名字随便起，但是itemValue需要与子组件暴露的属性名一致 -->
      <!-- <template v-slot:default="slotProps">
        <span v-if="slotProps.itemValue.id%2 == 0">√</span>
        {{ slotProps.itemValue.text }}
      </template> -->
      <template #default="{itemValue}">
        <span v-if="itemValue.id%2 == 0">√</span>
        {{itemValue.text}}
      </template>
    </zy-todo>
    <prop-obj-test :info="testInfoData" @onValChange="changeVal($event)"></prop-obj-test>
  </div>
</template>

<script>
// 没有通过 vue.use 方式安装的组件，不为全局组件，需要通过import配合components的方式在业务代码中使用
import buButton from './components/button.vue'
import propObjTest from './components/propsObjTest.vue'
export default {
  name: 'App',
  data () {
    return {
      question: "",
      answer: "请输入您的问题",
      inputVal: "初始化默认值",
      todos: [
        {
          id: 1,
          text: "todo-1"
        },
        {
          id: 2,
          text: "todo-2"
        },
        {
          id: 3,
          text: "todo-3"
        },
        {
          id: 4,
          text: "todo-4"
        },
      ],
      testInfoData : {
        name:"zhang",
        age:20,
        num:""
      }
    }
  },
  components: {
    buButton,
    propObjTest
  },
  // components:{
  //   'bu-button':buButton
  // },
  created () {
    this.dataNotInData = 1 // 这种方式可以定义不需要被vue依赖收集的数据，但是不能在计算属性或者 watch 中使用，否则依旧会被依赖收集器收集到。
  },
  // 定义在mounted中的数据会报错，因为template页面渲染的时候需要用到这个变量
  // mounted () {
  //   this.dataNotInData = 1 
  // },
  methods: {
    nativeClick (e) {
      console.log("native click!!!", e)
      this.dataNotInData++ // dataNotInData改变后，页面ui不会发生变化
    },
    click (e) {
      console.log("component click!!!", e)
    },
    changeVal(){
      this.testInfoData.num = Math.random()
    }
  },
  watch: {
    question (newVal, oldVal) {
      setTimeout(() => {
        console.log(oldVal)
        this.answer = newVal
      }, 1000)
    }
  },
  computed: {

  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
