const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
    entry: './src/entry-client.js',
    externals: {        
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueSSRClientPlugin()
    ]
});