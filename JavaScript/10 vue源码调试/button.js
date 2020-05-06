// template 和 render 同时出现时，以render函数的结果为准，即render的优先级比template高
const zySlot = Vue.component("zy-button", {
    template: `
        <div>
        默认数据
        <slot name="header" ></slot>
        <slot></slot>
        <slot name="footer"></slot>
        </div>
    `,
    render: function (createElement) {
        var header = this.$slots.header
        var body = this.$slots.default
        var footer = this.$slots.footer
        return createElement('div', [
            createElement('header', header),
            createElement('main', body),
            createElement('footer', footer)
        ])
    }
})

export {zySlot}