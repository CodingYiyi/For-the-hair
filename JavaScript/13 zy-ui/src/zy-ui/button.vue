<template>
  <button class="zy-button"
          :class="classes"
          @click="onclick($event)">
         <span class="text" v-if="$slots.default"><slot></slot></span> 
         <zy-icon v-if="icon"></zy-icon>
  </button>
</template>
<script>
export default {
  name: "zy-button",
  props: {
    type: {
      type: String,
      required: false,
      default: "primary",
      validator (type) {
        if (!["primary", "danger", "info"].includes(type)) {
          console.log("type value error")
        }
        return true
      }
    },
    round:{
        type:Boolean,
        required:false
    },
    icon:{
        type:String,
        required:false
    }
  },
  methods: {
    onclick () {
      console.log("组件内部逻辑")
      this.$emit("selfClick", "来自子组件的数据") // 通过 $emit 的方式实现子组件向父组件传递数据，第一个参数为父组件中绑定的事件名，第二个参数为子组件传递给父组件的数据（父组件通过$event获取）
      /**
       * <zy-button type="primary" @click.native="nativeClick()" @selfClick="click($event)"></zy-button>
       */
    }
  },
  computed: {
    classes () {
        let classes = []
        if(this.round){
            classes.push("round")
        }
        if(this.type){
            classes.push(`zy-button-${this.type}`)
        }
      return classes
    }
  }
}
</script>

<style lang="scss" scoped>
.zy-button {
  border: 1px solid blue;
  outline: none;
  .text{
      color:#333;
      font-size:16px;
  }
  &.round{
      border-radius: 4px;
  }
  &:hover{
      transform: scale(1.1);
  }
}
.zy-button-primary {
}
.zy-button-info {
  border: 1px solid green;
}
.zy-button-danger {
  border: 1px solid red;
}
</style>