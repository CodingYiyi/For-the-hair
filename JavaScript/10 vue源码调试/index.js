const zyButton = Vue.component("zy-button", {
    template: `
        <div>
        默认数据
        <slot name="header" ></slot>
        <slot></slot>
        <slot name="footer"></slot>
        </div>
    `,
    // render: function (createElement) {
    //     var header = this.$slots.header
    //     var body = this.$slots.default
    //     var footer = this.$slots.footer
    //     return createElement('div', [
    //         createElement('header', header),
    //         createElement('main', body),
    //         createElement('footer', footer)
    //     ])
    // }
})

var app = new Vue({
    el: '#app',
    // data: {
    //     message: 'Hello Vue!',
    //     count: 1,
    //     list: [
    //         {
    //             checked: false,
    //             text: "a"
    //         },
    //         {
    //             checked: false,
    //             text: "b"
    //         },
    //         {
    //             checked: false,
    //             text: "c"
    //         },
    //     ]
    // },
    components: { zyButton },
    data () {
        // this.test = "test data"
        this.dataNotInData = "初始化数据"
        return {
            userInfo: {},
            slot:"footer"
        }
    },
    methods: {
        // addCount () {
        //     this.count++
        // },
        // deleteFirstItem () {
        //     this.list.shift()
        // },
        // addFirstItem () {
        //     this.list.unshift({
        //         checked: false,
        //         text: Math.random()
        //     })
        // },
        changeData () {
            console.log(this.dataNotInData)
            this.userInfo.name = Math.random()
            this.dataNotInData = `dataNotInData的值为:${Math.random()}`
            // this.test = Math.random()
        }
    },
    created () {
        setTimeout(_ => {
            this.userInfo = Object.freeze({
                name: "zhangyi"
            })
        }, 3000)
        this.dataNotInData = "不会被依赖收集"
    },
    // watch:{
    //     test:function(){
    //         console.log("changed!!!")
    //         this.dataNotInData = `dataNotInData的值为:${Math.random()}`
    //     }
    // },
    // computed:{
    //     test(){
    //         return this.dataNotInData
    //     }
    // }
    mounted () {
        console.log(this.$data.userInfo === this.userInfo)
    }
})

console.log(app)