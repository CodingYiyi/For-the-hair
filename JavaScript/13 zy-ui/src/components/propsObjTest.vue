<template>
  <div>
      {{info}}
      <button @click="changeVal" >改变值</button>
  </div>
</template>

<script>
export default {
    name:"props-obj-test",
    props:{
        info:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    methods:{
        changeVal(){
            this.$emit("onValChange",1)
        }
    }
}
</script>

<style>

</style>