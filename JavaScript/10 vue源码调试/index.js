import {zySlot as zyySlot} from './button.js' // as 指定别名

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
    components: { 'zyyslot':zyySlot }, // 'zyyslot' 指定了html中标签的名称;若不指定，默认将驼峰命名转换为中划线形式，不区分大小写：zyySlot -> zyy-slot
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
            // this.userInfo.name = Math.random() // 对 freeze 的数据更改会报错
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
