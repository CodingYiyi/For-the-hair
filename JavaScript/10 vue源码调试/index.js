var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        count:1,
        list:[
            {
                checked:false,
                text:"a"
            },
            {
                checked:false,
                text:"b"
            },
            {
                checked:false,
                text:"c"
            },
        ]
    },
    methods:{
        addCount(){
            this.count++
        },
        deleteFirstItem(){
            this.list.shift()
        },
        addFirstItem(){
            this.list.unshift({
                checked:false,
                text:Math.random()
            })
        }
    }
})