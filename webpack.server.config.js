const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.config.js')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
    entry: './src/entry-server.js',
    target: 'node',
    output: {
        libraryTarget: 'commonjs2',
    },
    externals: nodeExternals({
        // 外置化应用程序依赖模块。可以使服务器构建速度更快, 并生成较小的 bundle 文件。
        // 单有时你不想外置化 webpack 需要处理的依赖模块。
        whitelist: /\.css$/
    }),
    plugins: [
        new VueSSRServerPlugin()
    ]
});