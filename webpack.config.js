const VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = {
    mode: process.env.NODE_ENV || 'development',
    plugins: [
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    'vue-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
module.exports = config