import Vue from 'vue'
import App from './App.vue'
import zyui from './zy-ui'


Vue.config.productionTip = false

// 通过插件的方式注入全局组件，全局组件不需要在每个业务组件中使用 import 
// https://cn.vuejs.org/v2/guide/plugins.html
Vue.use(zyui)

new Vue({
  render: h => h(App),
}).$mount('#app')
