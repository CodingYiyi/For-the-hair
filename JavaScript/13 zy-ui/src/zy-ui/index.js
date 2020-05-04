// import 所有全局公共组件
// import button from  './button.vue'

// Vue.use 方式注册插件必须提供 install 方法
const install = function (Vue) {
    // 通过 Vue.component 方法注册全局组件
    // https://cn.vuejs.org/v2/api/#Vue-component
    // Vue.component(button.name,button)

    // 上述方式在注册多个组件的时候写法略繁琐，可采用下述写法
    // https://cn.vuejs.org/v2/guide/components-registration.html#基础组件的自动化全局注册
    // https://webpack.docschina.org/guides/dependency-management/#require-context
    const requireComponents = require.context('.', false, /\.vue$/)
    requireComponents.keys().forEach(fileName => {
        let compM = requireComponents(fileName)
        Vue.component(compM.default.name, compM.default)
    });
    /**
    require.context module API 
    一个 context module 会导出一个（require）函数，此函数可以接收一个参数：request。
    此导出函数有三个属性：resolve, keys, id
    resolve 是一个函数，它返回 request 被解析后得到的模块 id。
    keys 也是一个函数，它返回一个数组，由所有可能被此 context module 处理的请求。
    */
}

export default { install }