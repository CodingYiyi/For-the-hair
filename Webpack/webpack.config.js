const path = require("path")
const webpack = require("webpack")
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    mode: "development", // webpack4 新增属性
    entry: {

    },
    output: {

    },
    module: {
        loaders: []
    },
    plugins: [
        new webpack.DefinePlugin(), // 打包阶段定义全局变量
        new webpack.HashedModuleIdsPlugin(), // 保持hash稳定，利用浏览器缓存策略避免重复请求
        new webpack.ProvidePlugin({
            $: 'jquery'
        }), // 统一管理频繁使用的库，可以在业务代码中直接使用$而无需import，当然直接写在window上也是可以的，但是会污染全局环境
        new CopyWebpackPlugin({
            // from  定义要拷贝的源文件            from：__dirname+ '/src/components'
            // to      定义要拷贝到的目标文件夹  to: __dirname + '/dist'
            // toType  file 或者 dir                        可选，默认是文件
            // force   强制覆盖前面的插件            可选，默认是文件
            // context  可选，默认base   context可用specific  context
            // flatten  只拷贝指定的文件               可以用模糊匹配
            // ignore  忽略拷贝指定的文件            可以模糊匹配
        }),
        new webpack.DllPlugin({ // 优化打包速度，需要配合 webpack.DllReferencePlugin 使用

        })
    ],
    resolve: {

    }
}