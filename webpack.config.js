const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './src/',
    output: {
        library: 'VueBasicTable',
        libraryTarget: 'commonjs2',
        filename: 'basic-table.js',
        path: resolve('dist'),
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true
                }
            },
            { test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('vue-swipe.css')
    ]
};